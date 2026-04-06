
//central error Handler
// express knows it's an error handler because it has 4 params (err, req, res, next)


const errorHandler = (err, req, res, next) => {


  console.error("caught error:", err.message);


    //mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} is already taken`,
      data: null,
    });
  }


  //validation failure — missing required fields etc
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
      data: null,
    });
  }


  //// jwt expired or tampered
   if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "session expired, please login again",
      data: null,
    });
  }


  //  everything else
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "internal server error",
    data: null,
  })
};

export default errorHandler;