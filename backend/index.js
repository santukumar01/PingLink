const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/dbConnect");

dotenv.config();

const app = express();

const PORT = process.env.PORT;
process.env.connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
