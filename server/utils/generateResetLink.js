const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// sendGridMail object
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Emails time sensitive password reset link to user
async function generateResetLink(email, emailToken) {
  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDER,
      subject: "Password Reset",
      text: "Password reset instructions:",
      html: `<h3>Follow the link below to reset your password.</h3>
             <a href="${process.env.SERVER_DOMAIN}/api/users/password-reset-link-validate/${emailToken}" target="_blank" rel="noopener">Reset password</a>
             <p>Please note this link will only be active for 15 minutes</p>
            `,
    });
    console.log("Reset link Email sent successfully to: " + email);
  } catch (error) {
    console.log(error.response.body); // test
    throw new Error("Email sending failed");
  }
}

module.exports = generateResetLink;
