const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use("/", routes);

app.listen(0113, () => {
  console.log(0113, "Welcome Steam Search Service");
});
