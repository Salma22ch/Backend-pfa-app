const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
let middleware = require("../middleware");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
var FormData = require("form-data");

router.get("/users", async (req, res) => {
  User.find({}, async (err, data) => {
    if (err) {
      await res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

router.route("/predict").post(upload.single("mydata"), (req, res) => {
  let data = fs.readFileSync(path.join("uploads/" + "mydata.csv"));
  console.log(data);

  var bodyFormData = new FormData();
  // fs.readFileSync(path.join("uploads/" + "mydata.csv"));
  //form.append('productImage', file, 'stickers.jpg');
  bodyFormData.append("mydata", data, "mydata.csv");

  axios({
    method: "post",
    url: "http://127.0.0.1:3004/predictionsAPI",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      console.log(
        "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
      );
      console.log(response);
    })
    .catch(function (response) {
      console.log(
        "------------------------------------------------------------------"
      );

      console.log(response);
    });

  res.send({
    status: true,
    message: "File is uploaded",
  });
});

router.route("/register").post((req, res) => {
  console.log("inside the register");
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then(() => {
      console.log("user registered");
      res.status(200).json({ msg: "User Successfully Registered" });
    })
    .catch((err) => {
      res.status(403).json({ msg: err });
    });
});
router.route("/login").post((req, res) => {
  User.findOne({ email: req.body.email }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    if (result === null) {
      return res.status(403).json("Email incorrect");
    }
    if (result.password === req.body.password) {
      // here we implement the JWT token functionality
      let token = jwt.sign({ email: req.body.email }, config.key, {
        expiresIn: "2h",
      });

      res.json({
        email: req.body.email,
        token: token,
        msg: "success",
      });
    } else {
      res.status(403).json("password is incorrect");
    }
  });
});

module.exports = router;
