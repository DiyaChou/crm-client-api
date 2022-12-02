const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");

const userAuthorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    var auth = authorization.split(" ");
    if (auth[0] !== "Bearer") throw "not a bearer token";

    const decoded = await verifyAccessJWT(auth[1]);
    console.log("decoded", decoded);
    if (decoded.email) {
      const userId = await getJWT(auth[1]);
      if (!userId) return res.status(403).json({ messsage: "Forbidden" });
      req.userId = userId;
      return next();
    }

    await deleteJWT(auth[1]);
    return res.status(403).json({ message: "Forbidden" });
    // extract user id
    // get user profile based on the userid
  } catch (error) {
    return error;
  }
};

module.exports = {
  userAuthorization,
};
