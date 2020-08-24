var express = require("express");
var admin = require("firebase-admin");
require("dotenv").config();
var app = express();
var bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

var db = admin.database();

app.get("/", (req,res) => {
    res.sendFile("public/index.html");
})

app.get("/rewards/:username", async (req, res) => {
  var name = req.params.username;
  var data = await db.ref("rewards/" + name).once("value");
  if (data.val() === null) {
    res.json({ name: name, points: 0 });
  } else {
    var points = data.val().points;
    console.log(data.val());
    res.json({ name: name, points: points });
  }
});

app.post("/rewards", async (req, res) => {
  var name = req.body.username;
  var newPoints = req.body.points;
  var data = await db.ref("rewards/" + name).once("value");
  let points;
  if (data.val() === null) {
    points = 0;
  } else {
    points = data.val().points;
  }
  db.ref("rewards/" + name).set({
    points: parseInt(points) + parseInt(newPoints),
  });
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Runing on ${port}`);
});
