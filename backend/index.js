import express from "express";
import bodyParser from "body-parser";
import routes from "./index.routes";
import mongoose from "mongoose";
import bluebird from "bluebird";

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

try {
  // make bluebird default Promise
  Promise = bluebird;
  mongoose.Promise = Promise;

  // connect to mongo db
  const mongoUri = process.env.MONGO_URI;

  mongoose.connect(
    mongoUri,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      poolSize: 2,
      promiseLibrary: global.Promise
    },
    err => {
      if (err) {
        throw new Error(`unable to connect to database: ${mongoUri}`);
      } else {
        console.log("Connected to MongoDB");
      }
    }
  );
} catch (e) {
  console.error(e);
}

app.listen(process.env.PORT || 3001, () => {
  console.log(
    "=========== STARTING UP NOS FLIP SERVER ON PORT 3001 ==========="
  );
});
