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

// upload csv file
const storage_csv = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads2");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + ".csv");
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "text/csv" || file.mimetype == "	text/csv") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

router.get("/users", async (req, res) => {
  User.find({}, async (err, data) => {
    if (err) {
      await res.status(500).send();
    } else {
      res.status(200).send(data);
    }
  });
});

var upload = multer({
  storage: storage_csv,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});

router.route("/add/:id/file").patch(upload.single("csv"), (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        csv: req.file.path,
      },
    },
    { new: true },
    (err, user) => {
      if (err) return res.status(500).send(err);
      const response = {
        message: "file added successfully ",
        data: user,
      };
      return res.status(200).send(response);
    }
  );
});

var storageCSV = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});

var uploadCSV = multer({ storage: storageCSV });

router.route("/predict").post(uploadCSV.single("mydata"), (req, res) => {
  let data = fs.readFileSync(path.join("uploads/" + req.file.filename));
  console.log(data);

  var bodyFormData = new FormData();
  bodyFormData.append("mydata", data, "rnn_energy_testData.csv");

  axios({
    method: "post",
    url: "https://python-web-service.herokuapp.com/predictionsAPI",
    data: bodyFormData,
    headers: bodyFormData.getHeaders(),
  })
    .then(function (response) {
      res.send({
        status: true,
        dataPredicted: response.data,
      });
    })
    .catch(function (response) {
      res.send({
        status: false,
        response: response,
      });
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
      let token = jwt.sign(
        {
          id: result.id,
          email: result.email,
        },
        config.key,
        {
          expiresIn: "2h",
        }
      );

      res.json({
        id: result.id,
        email: result.email,
        token: token,
        msg: "success",
      });
    } else {
      res.status(403).json("password is incorrect");
    }
  });
});

router.get("/user/:id", async (req, res) => {
  User.findById(
    { _id: req.params.id },
    "_id email battery panels consumption",
    async (err, data) => {
      if (err) {
        await res
          .status(500)
          .send(`Cannot find user with this ID : ${req.params.id}`);
      } else {
        res.status(200).send(data);
      }
    }
  );
});

// add battery data

router.put("/user/:id/battery", async (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      battery: [req.body.cara1, req.body.cara2],
    },
    { new: true },
    async (err, data) => {
      if (err) {
        await res
          .status(500)
          .send(`Cannot find user with this ID : ${req.params.id}`);
      } else {
        res.status(200).json({
          message: `battery is updated`,
        });
      }
    }
  );
});
// panels
router.put("/user/:id/panels", async (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      panels: [req.body.cara1, req.body.cara2],
    },
    { new: true },
    async (err, data) => {
      if (err) {
        await res.status(500).send(`Error occured: ${req.params.id}`);
      } else {
        res.status(200).json({
          message: `panels is updated`,
        });
      }
    }
  );
});

// consumption
router.put("/user/:id/consumption", async (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      consumption: [
        req.body.one,
        req.body.second,
        req.body.third,
        req.body.fourth,
        req.body.fifth,
      ],
    },
    { new: true },
    async (err, data) => {
      if (err) {
        await res.status(500).send(`Error occured : ${req.params.id}`);
      } else {
        res.status(200).json({
          message: `consumption is updated`,
        });
      }
    }
  );
});

module.exports = router;
