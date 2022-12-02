const { randomPinNumber } = require("../../utils/randomGenerator");
const { ResetPinSchema } = require("./ResetPin.schema");

const setPasswordResetPin = async (email) => {
  try {
    if (!email) {
      return error;
    }
    //random 6 digit
    const randPin = randomPinNumber(6);
    const resetObj = {
      email,
      pin: randPin,
    };
    console.log("randPin", randPin);
    return new Promise((resolve, reject) => {
      ResetPinSchema(resetObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  } catch (error) {
    console.log("catch", error);
    return error;
  }
};

module.exports = { setPasswordResetPin };
