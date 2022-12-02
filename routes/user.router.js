const router = require("express").Router();
const { hashedPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const { setPasswordResetPin } = require("../model/resetPin/ResetPin.model");
const {
  insertUser,
  getUserByEmail,
  getUserById,
} = require("../model/user/User.model");

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user route" });
  next();
});

router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;

  const userProf = await getUserById(_id);
  console.log("inside router userProf", userProf);
  // const { password, ...rest } = userProf;
  // return res.json({ user: rest });
  return res.json({ user: userProf });
});

router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    const hashedPass = await hashedPassword(password);
    console.log("hashedPass", hashedPass);
    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };
    const result = await insertUser(newUserObj);
    console.log("result", result);
    res.json({ message: "New User created", result });
  } catch (err) {
    res.json({ status: "error", message: err.message });
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
    return error;
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    /**
     * A) create and send password reset pin number
     * 1. receive email
     * 2. check if user exists for the email
     * 3. create unique 6 digit pin
     * 4. save pin and email in db
     * 5. email the pin
     *
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

    const { email } = req.body;
    console.log(email);
    const user = await getUserByEmail(email);
    console.log(user);

    if (user && user._id) {
      const setPin = await setPasswordResetPin(email);
      console.log("setPin", setPin);
      return res.json(setPin);
    }

    return res.join({
      status: "error",
      message:
        "If the email exists in out database, the password reset pin will be sent shortly",
    });
  } catch (error) {}
});

module.exports = router;
