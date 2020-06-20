const express = require("express");
const router = require("./router/router");
const userRouter = require("./router/user");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

//connect to Database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to dataBase"))
  .catch((err) => console.log("dataBase connection error", err));

//morgan just makes you know your route request in a developerMODE
app.use(morgan("dev"));
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
//cors helps developers link our projects running from different PORTs
app.use(cors()); //<= this allows all origin? ports
//and if you want to restrict your CORS (either of the two)..
// if ((process.env.NODE_ENV = "development")) {
//   app.use(cors({ origin: `http://localhost:3000` }));
// }

app.use("/api", router);
app.use("/api", userRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`connected to port ${port} ${process.env.NODE_ENV}`);
});
