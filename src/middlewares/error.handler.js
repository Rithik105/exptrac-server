const errorHandler = (error, req, res, next) => {
  if (error.isKnown) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = errorHandler;
