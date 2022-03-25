const express = require("express");
const mongoose = require("mongoose");
const { port } = require("./config/key");
const routes = require("./routes");

const url = 'mongodb://localhost/byit-be-iam'
const app = express();
app.use(express.json());


mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("Connected!")
  )
  .catch((err) => console.log(err));

  app.use(routes);

  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });