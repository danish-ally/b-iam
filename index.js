require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { port } = require("./config/key");
const routes = require("./routes");
const cors = require("cors");
const passport = require("passport");

const url = "mongodb://localhost/byit-be-iam";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

mongoose
  .connect(process.env.DATABASE_ACCESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"))
  .catch((err) => console.log(err));

require("./config/passport");
app.use(routes);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});


