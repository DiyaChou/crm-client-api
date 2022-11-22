const bcrypt = require("bcryptjs");
const saltRounds = 10;

const hashedPassword = (plainPassword) => {
  return new Promise((resolve) =>
    resolve(bcrypt.hashSync(plainPassword, saltRounds))
  );
};

const comparePassword = (plainPass, passFromDb) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPass, passFromDb, function (err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = { hashedPassword, comparePassword };