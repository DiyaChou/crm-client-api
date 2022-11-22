const router = require("express").Router();
const { hashedPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { insertUser, getUserByEmail } = require("../model/user/User.model");

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user route" });
  next();
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
    console.log(result);
    res.json({ message: "New User created", result });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ status: "error", message: "Invalid Form Submission" });

  const user = await getUserByEmail(email);
  console.log(user);

  const passFromDB = user && user._id ? user.password : null;

  if (!passFromDB)
    return res.json({ status: "error", message: "Invalid email or password" });

  const result = await comparePassword(password, passFromDB);
  if (!result)
    return res.json({ status: "error", message: "Invalid email or password" });

  const accessJWT = await createAccessJWT(user.email);
  const refreshJWT = await createRefreshJWT(user.email);

  return res.json({
    status: "success",
    message: "Login Successfully!",
    accessJWT,
    refreshJWT,
  });
});

module.exports = router;
