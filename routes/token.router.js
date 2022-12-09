const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
const { getUserByEmail } = require("../model/user/User.model");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const auth = authorization.split(" ");
    if (auth[0] !== "Bearer") throw "not a bearer token";
    //todo
    // make sure token is valid
    const decoded = await verifyRefreshJWT(auth[1]);
    // check if the jwt exists in db
    if (!decoded.email) return res.status(403).json({ message: "Forbidden" });

    const userProf = await getUserByEmail(decoded.email);
    if (!userProf._id) return res.status(403).json({ message: "Forbidden" });

    let tokenExp = userProf.refreshJWT.addedAt;
    const dbRefreshToken = userProf.refreshJWT.token;

    tokenExp.setDate(tokenExp.getDate() + +process.env.JWT_REFRESH_EXP_DAYS);
    tokenExp = tokenExp.getTime();
    const today = new Date().getTime();

    // check if token is not expired
    console.log(decoded.email, userProf._id);
    if (tokenExp < today || dbRefreshToken !== auth[1]) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const accessJWT = await createAccessJWT(decoded.email, `${userProf._id}`);
    return res.json({ status: "success", accessJWT });
  } catch (error) {
    return error;
  }
});
module.exports = router;
