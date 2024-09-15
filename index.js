const express = require("express");
const app = express();
const port = 3080;
const cors = require("cors");
const mysql = require("mysql");
const {
  createDoctorContent,
  createUserContent,
  otpGeneratorContent,
} = require("./Send_Email/emaildata");
const { sendEmail } = require("./Send_Email/sendEmail");
const { createToken, varifyToken } = require("./Token/TokenGenerator");
require("dotenv").config();

// https://github.com/kamruzzamanripon/CRUD-React-Node-MySql/blob/master/server/index.js
app.use(cors());
app.use(express.json());

// twilio
//password: Rasel505959#A**#
//email:amsohelrana.me
//88001722305054

//database

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "mysqlcrud",
});

app.get("/allemployees", (req, res) => {
  db.query("SELECT * FROM employees", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/alldepartments", (req, res) => {
  db.query("SELECT * FROM departments", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// post department data

app.post("/departments", (req, res) => {
  const { department_name } = req.body;
  if (!department_name) {
    return res.status(400).json({ error: "Department name is required." });
  }
  const query = "INSERT INTO departments (department_name) VALUES (?)";
  db.query(query, [department_name], (err, result) => {
    if (err) {
      console.error("Error inserting data into the departments table:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while inserting data." });
    }
    // Respond with the inserted department ID and success message
    res.status(201).json({
      message: "Department added successfully!",
      department_id: result.insertId,
    });
  });
});
// post employees data

app.post("/employees", (req, res) => {
  const { employee_name, age, email, department_id, salary, status } = req.body;
  // Check for missing required fields
  if (!employee_name || !email) {
    return res
      .status(400)
      .json({ error: "Employee name and email are required." });
  }
  // Insert query with parameterized values
  const query = `
   INSERT INTO employees (employee_name, age, email, department_id, salary, status)
   VALUES (?, ?, ?, ?, ?, ?)
 `;
  // Execute the query
  db.query(
    query,
    [employee_name, age, email, department_id, salary, status],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into the employees table:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while inserting data." });
      }

      // Return success response with the inserted employee ID
      res.status(201).json({
        message: "Employee added successfully!",
        employee_id: result.insertId,
      });
    }
  );
});

// cteate post method in contact
app.post("/contact", (req, res) => {
  const { email, first_name, last_name, subject, message } = req.body;
  // Validate input: check for null or empty values
  if (!email || !first_name || !last_name || !subject) {
    return res
      .status(400)
      .json({ error: "Required fields cannot be null or empty" });
  }

  const sql =
    "INSERT INTO Contact (email, first_name, last_name, subject, message) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [email, first_name, last_name, subject, message],
    (err, result) => {
      if (err) {
        res.status(500).send("Server Error");
      } else {
        res
          .status(201)
          .send({ message: "Contact Recorded successfully!", data: result });
      }
    }
  );
});
// get all contact list
app.get("/all_contacts_list", (req, res) => {
  db.query("SELECT * FROM Contact", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database query error", details: err });
    }
    res.status(200).json({
      message: "Successfully Get All Contact Data",
      data: results,
    });
  });
});

// send email
app.get("/send_email", async (req, res) => {
  // start generate token

  const tokenData = {
    userId: 1,
    useremail: "hitech1986electronic@gmail.com",
  };

  const token = createToken(tokenData, "10m");

  const UserAuthenticationLink =
    process.env.AUTHENTICATION__LINK +
    `?id=${tokenData?.userId}&token=${token}`;

  const EmailData = createUserContent({
    token: UserAuthenticationLink,
  });

  const info = await sendEmail(
    "hitech1986electronic@gmail.com",
    EmailData.email_body,
    "Authentication Token"
  );
  if (!info.messageId) {
    return res.send({
      status: httpStatus.NOT_FOUND,
      message: error?.message,
    });
  }

  res.send({ message: "Successfully Emiled Sended", UserAuthenticationLink });
});
// 5 digit Auth System

app.get("/otp_email", async (req, res) => {
  const OTP = Math.floor(10000 + Math.random() * 90000);
  const otpemaildata = {
    verificationcode: OTP,
  };

  const emaildata = otpGeneratorContent(otpemaildata);
  const info = await sendEmail(
    "hitech1986electronic@gmail.com",
    emaildata.email_body,
    "Your Verification OTP"
  );
  if (!info.messageId) {
    return res.send({
      status: httpStatus.NOT_FOUND,
      message: error?.message,
    });
  }
  res.send({ message: "Successfully Send Your OTP, Plase Checked Your Email" });
});

app.get("/varify_token", async (req, res) => {
  //VARIFY_TOKEN
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
