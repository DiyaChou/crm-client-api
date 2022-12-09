const nodemailer = require("nodemailer");

const send = async (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "cristobal.rice@ethereal.email",
          pass: "mESJXayDCw74kWGaBk",
        },
      });

      let result = await transporter.sendMail(info);
      console.log("result", result);
      console.log("Message sent: %s", result.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      resolve(result);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const emailProcessor = async ({ email, pin, type, verificationLink }) => {
  let info;
  try {
    console.log({ email, pin, type, verificationLink });
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
          from: '"CRM Company" <cristobal.rice@ethereal.email>', //sender
          to: email, //list of recievers
          subject: "Password updated",
          text: "Password has been updated",
          html: "<p>Password has been updated</p>",
        };
        break;
      case "new-user-confirmation-required":
        info = {
          from: '"CRM Company" <cristobal.rice@ethereal.email>', //sender
          to: email, //list of recievers
          subject: "Verification Mail: Please verify your email",
          text: "please follow the link to verify your account. ",
          html: `<p>please follow the link to verify your account. </p>
          <p>${verificationLink}</p>
          `,
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
