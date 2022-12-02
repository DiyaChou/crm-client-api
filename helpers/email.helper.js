const nodemailer = require("nodemailer");
const { ResetPinSchema } = require("../model/resetPin/ResetPin.schema");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "merl47@ethereal.email",
    pass: "UnbcZRsU8g56q7MUz9",
  },
});

console.log("transporter", transporter);

const send = async (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);
      console.log("Message sent: %s", result.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      resolve(result);
    } catch (error) {
      console.log(error);
      // reject(error);
    }
  });
};

const emailProcessor = async ({ email, pin, type }) => {
  let info;
  try {
    console.log({ email, pin, type });
    switch (type) {
      case "request-new-password":
        info = {
          from: '"CRM Company" <merl47@ethereal.email>', //sender
          to: email, //list of recievers
          subject: "Password reset Pin",
          text:
            "Here is your password reset pin " +
            pin +
            ". This pin will expire in 1day",
          html: `Hello!\nHere is your password reset pin <b>${pin}</b>. This pin will expire in 1day`,
        };

        break;
      case "password-update-success":
        info = {
          from: '"CRM Company" <merl47@ethereal.email>', //sender
          to: email, //list of recievers
          subject: "Password updated",
          text: "Password has been updated",
          html: "<p>Password has been updated</p>",
        };
        break;
      default:
        break;
    }

    send(info);
  } catch (error) {
    return error;
  }
};

module.exports = { emailProcessor };
