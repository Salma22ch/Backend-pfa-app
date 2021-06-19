const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
let middleware = require("../middleware");
const router =express.Router();

router.get("/users", async (req, res) => {
    User.find({}, async (err, data) => {
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
           let token = jwt.sign({ 
             id : result.id,
             email: result.email
           }, config.key, {
               expiresIn:"2h"
           });
      
           res.json({
              id : result.id,
              email: result.email,
              token: token,
              msg: "success",
            });
         
          } else {
            res.status(403).json("password is incorrect");
          }
        });
 });

  router.route(`/:email`).get((req, res) => {
        User.findOne({ email: req.params.email }, (err, result) => {
          if (err) return res.status(500).json({ msg: err });
          if (result === null) {
            return res.status(403).json("not such user");
          }else{
            return res.json(result);
          }
          
        });
 });

 router.get("/user/:id",async (req, res) => {
    User.findById({ _id: req.params.id }, '_id email battery panels consumption', async (err, data) => {
        if (err) {
            await res
                .status(500)
                .send(`Cannot find user with this ID : ${req.params.id}`);
        } else {
            res.status(200).send(data);
        }
    });
});

 // add battery data 

 router.put("/user/:id/battery", async (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.params.id },
        {
            battery: req.body.battery
        }, { new: true },
        async (err, data) => {
            if (err) {
                await res
                    .status(500)
                    .send(`Cannot find user with this ID : ${req.params.id}`);
            } else {

                res.status(200).json({
                    message: `battery is updated`
                });
            }
        })
})
// panels
 router.put("/user/:id/panels", async (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.params.id },
        {
            panels: req.body.panels
        }, { new: true },
        async (err, data) => {
            if (err) {
                await res
                    .status(500)
                    .send(`Cannot find user with this ID : ${req.params.id}`);
            } else {

                res.status(200).json({
                    message: `panels is updated`
                });
            }
        })
})

// consumption
 router.put("/user/:id/consumption", async (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.params.id },
        {
            panels: req.body.userconsumption
        }, { new: true },
        async (err, data) => {
            if (err) {
                await res
                    .status(500)
                    .send(`Cannot find user with this ID : ${req.params.id}`);
            } else {

                res.status(200).json({
                    message: `panels is updated`
                });
            }
        })
})


module.exports=router;