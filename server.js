const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const contactRoute = require("./routes/contactRoutes");
const userRoute = require("./routes/userRoutes");
const connectDb = require("./config/dbConnection");
const validateToken = require("./middleware/validateTokenHandler");
const dotenv = require("dotenv").config();
// console.log("dotenv", process.env.PORT);

connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON

app.use("/api/contacts", contactRoute); //app.use("/api/contacts", require("./routes/contactRoute") );
app.use("/api/user", userRoute);
app.use(errorHandler); // Error handling middleware

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
