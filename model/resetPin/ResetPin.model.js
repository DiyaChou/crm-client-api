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

const getPinByEmail = async (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOne({ email, pin }, function (error, data) {
        if (error) {
          console.log(error);
          resolve(false);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deletePin = async (_id) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findByIdAndDelete(_id)
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = { setPasswordResetPin, getPinByEmail, deletePin };
