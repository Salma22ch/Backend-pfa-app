const express = require("express");
const Batterydata = require("../models/battery.model");
const Panelsdata = require("../models/panels.model");
const config = require("../config");
let middleware = require("../middleware");
const router =express.Router();

router.get("/batterydata", async (req, res) => {
    Batterydata.findById({}, async (err, data) => {
        if (err) {
            await res.status(500).send();
        } else {
            res.status(200).send(data);
        }
    });
});


router.route("/register").post((req, res)=>{
    console.log("inside the register");
    const user = new User({
        email: req.body.email,
        password: req.body.password
      });
    user.save().then(() => {
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
               expiresIn:"2h"
           });
      
           res.json({
              email : req.body.email,
              token: token,
              msg: "success",
            });
         
          } else {
            res.status(403).json("password is incorrect");
          }
        });
 });

module.exports=router;