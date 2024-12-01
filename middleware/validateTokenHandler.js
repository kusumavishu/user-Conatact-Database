const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  console.log("Middleware triggered");
  let token;
  const authHeader = req.headers.Authorization || req.headers.authorization;
  console.log("bearer", authHeader);
  if (authHeader && authHeader.startsWith("Bearer")) {
    //extract the token
    token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);
    //verify
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err.message);
        res.status(401);
        throw new Error("user is not authorized");
      }
      console.log(">>>", decoded);
      req.user = decoded.user; // Attach the user info to the reques
      next();
    });
  } else {
    // Missing or invalid token
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});

module.exports = validateToken;
