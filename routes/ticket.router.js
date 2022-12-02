const router = require("express").Router();
router.all("/", (req, res, next) => {
  // res.json({ message: "return from user route" });
  next();
});
module.exports = router;
