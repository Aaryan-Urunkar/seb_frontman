const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const DB_FILE = "logins.json";

function readLogins() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveLogins(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/admin", (req,res)=>{
  const logins = readLogins();
  res.json(logins);
});

app.post("/login", (req, res) => {

    const sebHeader = req.headers["x-safeexambrowser"];

    if (!sebHeader) {
    return res.send("Open this page using Safe Exam Browser.");
    }

  const { name, roll, email } = req.body;

  let logins = readLogins();

  const existing = logins.find(user => user.roll === roll);

  if (existing) {
    return res.send("This roll number has already logged in.");
  }

  const loginRecord = {
    name,
    roll,
    email,
    ip: req.ip,
    time: new Date().toISOString()
  };

  logins.push(loginRecord);

  saveLogins(logins);

  res.redirect("https://www.hackerrank.com/cuc");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});