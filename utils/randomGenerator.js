const randomPinNumber = (length) => {
  let len = parseInt(length);
  if (isNaN(len)) return false;
  let pin = "";
  for (let i = 0; i < len; i++) {
    pin += Math.floor(Math.random() * 10);
  }
  return pin;
};

module.exports = { randomPinNumber };
