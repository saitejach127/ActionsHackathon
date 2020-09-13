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

app.get("/", (req, res) => {
  res.sendFile("public/index.html");
});

app.get("/user/:username", async (req, res) => {
  var name = req.params.username;
  var data = await db.ref("rewards/").once("value");
  if (data.val() === null) {
    return res.json({ name: name, points: 0 });
  } else {
    data = data.val();
    var repos = []
    for(const key of Object.keys(data)){
      if(data[key][name]){
        repos.push({
          repo: key,
          points: data[key][name]["points"]
        })
      }
    }
    return res.json({ name: name, contributions: repos });
  }
});

app.get("/repo/:repoName", async (req, res) => {
  var repoName = req.params.repoName;
  var data = await db.ref("rewards/" + repoName).once("value");
  var contributors = [];
  data = data.val();
  console.log(data);
  for (const key of Object.keys(data)){
    var temp = {};
    temp[key] = data[key]["points"]
    contributors.push(temp);
  }
  console.log(contributors);
  if (data === null) {
    return res.json({ repoName: repoName, result: "No contributors yet" });
  } else {
    return res.json({
      repoName,
      contributors
    });
  }
});

app.post("/rewards", async (req, res) => {
  var name = req.body.username;
  var newPoints = req.body.points;
  var repoName = req.body.repoName;
  var data = await db.ref(`rewards/${repoName}/${name}`).once("value");
  console.log(`rewards/${repoName}/${name}`);
  let points;
  if (data.val() === null) {
    points = 0;
  } else {
    points = data.val().points;
  }
  db.ref(`rewards/${repoName}/${name}`).set({
    points: parseInt(points) + parseInt(newPoints),
  });
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Runing on ${port}`);
});
