const createUserContent = (emailcontent) => {
  return {
    email_body: `
      <h3>Tech Group Email authentication</h3>
      <div>
          <p>Here is Your Token: ${emailcontent.token}</p>
         
      </div>
      `,
  };
};
const otpGeneratorContent = (emailcontent) => {
  return {
    email_body: `
        <h3>Dear User</h3>
        <div>
          <p>Greeting! Your Varification Code for Tech Group is ${emailcontent.verificationcode}. Plese Keep this code confidential and do not share it with Any One</p>
      </div>
        
        `,
  };
};

module.exports = {
  createUserContent,
  otpGeneratorContent,
};
