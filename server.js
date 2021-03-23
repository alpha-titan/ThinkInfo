require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const productRoute = require("./routes/product");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

//? Initialising middlewares

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

//! NOT RECOMMENDED WAY TO SET CORS, SHOULD USE CORS CONFIGURATION OR DYNAMIC CORS CONFIG IF APPLICATION GROWS
app.use(cors());
// ? Mongoose Config

// mongoose.set("toJSON", { virtuals: true });

// // ? Option config to avoid mongoose warnings
// const mongooseOptions = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useFindAndModify: false,
// };

// mongoose.connect(process.env.MONGO_DB_CONNECTION_URI, mongooseOptions, () => {
//   console.log("connected to database 🚀");
// });

// let db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));

// ? SQL DB




//?  fro tesing setting morgan not to clash with output report

if (process.env.NODE_ENV !== "test") {
  //!use morgan to log at command line
  app.use(morgan("combined")); //!'combined' outputs the Apache style LOGs
}

//? API Routes

app.use("/api", productRoute);

const port =
  process.env.NODE_ENV === "production"
    ? process.env.PORT_PRODUCTION
    : process.env.PORT_DEVELOPMENT;

app.listen(port, () => {
  console.log(`🚀 running on ${port}`);
});

module.exports = app; //! for testing
