const router = require("express").Router();
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { emailProcessor } = require("../helpers/email.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { deleteJWT } = require("../helpers/redis.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const {
  resetPasswordReqValidation,
  updatePasswordValidation,
  newUserValidation,
} = require("../middlewares/formValidation.middleware");
const {
  setPasswordResetPin,
  getPinByEmail,
  deletePin,
} = require("../model/resetPin/ResetPin.model");
const { ResetPinSchema } = require("../model/resetPin/ResetPin.schema");
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT,
  verifyUser,
} = require("../model/user/User.model");
const { UserSchema } = require("../model/user/User.schema");
const verificationURL = `http://localhost:3000/verification/`;
router.all("/", (req, res, next) => {
  // res.json({ message: "return from user route" });
  next();
});

router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;

  const userProf = await getUserById(_id);
  console.log("inside router userProf", userProf);
  const { name, email } = userProf;
  return res.json({
    user: {
      _id,
      name,
      email,
    },
  });
});

router.post("/", newUserValidation, async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    const hashedPass = await hashPassword(password);
    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };
    const user = await insertUser(newUserObj);
    const userInfo = {
      name: user.name,
      company: user.company,
      address: user.address,
      phone: user.phone,
      email: user.email,
    };
    //check verification

    await emailProcessor({
      email,
      type: "new-user-confirmation-required",
      verificationLink: verificationURL + user._id + "/" + user.email,
    })
      .then(() => console.log(1))
      .catch((err) => console.log("error emailProcessor", err));

    res.json({
      status: "success",
      message: "New User created",
      result: userInfo,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = `${Object.keys(err.keyValue)} Already Exists`;
    }
    res.json({ status: "error", message: err.message });
  }
});

//verify user after user is signed up
router.patch("/verify", async (req, res) => {
  try {
    const { _id, email } = req.body;
    console.log(_id, email);
    const result = await verifyUser(_id, email);
    //update our user database
    if (result.id) {
      return res.json({
        status: "success",
        message: "Your account has been activated, you may sign in now.",
      });
    }
    res.json({ status: "error", message: "Invalid request" });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ status: "error", message: "Invalid Form Submission" });

    const user = await getUserByEmail(email);
    // console.log("user", user);

    const passFromDB = user && user._id ? user.password : null;

    if (!passFromDB)
      return res.json({
        status: "error",
        message: "Invalid email or password",
      });

    const result = await comparePassword(password, passFromDB);
    if (!result)
      return res.json({
        status: "error",
        message: "Invalid email or password",
      });

    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, user._id);

    return res.json({
      status: "success",
      message: "Login Successfully!",
      accessJWT,
      refreshJWT,
    });
  } catch (error) {
    return res.json({ error });
  }
});

/**
 * A) create and send password reset pin number
 * 1. receive email
 * 2. check if user exists for the email
 * 3. create unique 6 digit pin
 * 4. save pin and email in db
 * 5. email the pin
 */

router.post("/reset-password", resetPasswordReqValidation, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (user && user._id) {
      const pinObj = await setPasswordResetPin(email);
      console.log("pinObj", pinObj);
      await emailProcessor({
        email,
        pin: pinObj.pin,
        type: "request-new-password",
      });

      return res.status(200).json({
        status: "ok",
        message:
          "If the email exists in out database, the password reset pin will be sent shortly",
      });
    }

    return res.join({
      status: "error",
      message: "Error",
    });
  } catch (error) {
    console.log(error);
    return res.join({
      status: "error",
      message: "Error",
    });
  }
});

/**
 * B) update Password in db
 * 1. recieve email, pin and new Password
 * 2. validate pin
 * 3. encrypt new password
 * 4. update password in db
 * 5. send email notification
 *
 * C) Server side form validation
 * 1. create middleware to validate form data
 */

router.patch("/reset-password", updatePasswordValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;
  try {
    const getPin = await getPinByEmail(email, pin);
    if (getPin._id) {
      today = new Date();
      const expiresIn = 1;
      let expDate = new Date(getPin.addedAt.getTime());
      expDate.setDate(expDate.getDate() + expiresIn);
      if (today < expDate) {
        const hashedNewPass = await hashPassword(newPassword);
        const user = await updatePassword(email, hashedNewPass);
        if (user._id) {
          await emailProcessor({
            email,
            type: "password-update-success",
          });
          await deletePin(getPin._id);
          return res.status(200).json({
            status: "success",
            message: "Your password has been updated",
          });
        }
      }
      throw new Error("Invalid or expired pin");
    }
    throw new Error("Invalid or expired pin");
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: error.message ? error.message : "Error Occured",
    });
  }
});

router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;
  const auth = authorization.split(" ");
  const _id = req.userId;

  await deleteJWT(auth[1]);
  const result = await storeUserRefreshJWT(_id, "");
  /**
   * 1. get jwt and verify
   * 2. delete accessJWT from redis database
   * 3. delete refreshjWt from mongodb
   */

  res.json({ result });
});

module.exports = router;
