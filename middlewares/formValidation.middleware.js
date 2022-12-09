const Joi = require("joi");

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});
const password = Joi.string().min(8).required();
const phone = Joi.string().min(10).max(10).required();
const shortString = Joi.string().min(2).max(50);

const resetPasswordReqValidation = (req, res, next) => {
  const schema = Joi.object({ email });
  const value = schema.validate(req.body);
  if (value.error)
    return res.json({ status: "error", message: value.error.message });
  next();
};

const updatePasswordValidation = (req, res, next) => {
  const pin = Joi.string().min(6).max(6);

  const schema = Joi.object({ email, pin, newPassword: password });
  const value = schema.validate(req.body);
  if (value.error)
    return res.json({ status: "error", message: value.error.message });
  next();
};

const createNewTicketValidation = (req, res, next) => {
  const sender = Joi.string().min(2).max(50).required();
  const message = Joi.string().max(1000).required();
  const subject = Joi.string().min(2).max(50).required();
  const openAt = Joi.date().required();

  const schema = Joi.object({ sender, message, subject, openAt });
  const value = schema.validate(req.body);

  console.log("value", value);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

const replyTicketMessageValidation = (req, res, next) => {
  const sender = Joi.string().min(2).max(50);
  const message = Joi.string().max(1000);

  const schema = Joi.object({ sender, message });
  const value = schema.validate(req.body);

  console.log("value", value);

  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: shortString,
    address: shortString,
    company: shortString,
    phone,
    email,
    password,
  });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

module.exports = {
  resetPasswordReqValidation,
  updatePasswordValidation,
  createNewTicketValidation,
  replyTicketMessageValidation,
  newUserValidation,
};
