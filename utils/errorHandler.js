const handleError = (error, res) => {
  console.log(error);
  res.json({
    message: error.message,
    status: error.status || 500,
  });
};

module.exports = handleError;
