const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const auth = require("../../middleware/auth");
const User = require("../../models/user");
const key = require("../../config/key");
const axios = require("axios").default;
var MongoClient = require('mongodb').MongoClient;
const url = process.env.DATABASE_ACCESS;

const { accessSecret, accessTokenLife, refreshSecret, refreshTokenLife } =
  key.jwt;

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // let status;

  if (!email) {
    return res.status(400).json({ error: "You must enter an email address." });
  }

  if (!password) {
    return res.status(400).json({ error: "You must enter a password." });
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res
        .status(400)
        .send({ error: "No user found for this email address." });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
        };

        jwt.sign(
          payload,
          accessSecret,
          { expiresIn: accessTokenLife },
          (err, AccessToken) => {
            res.status(200).json({
              success: true,
              AccessToken: `${AccessToken}`,
              user: user,
            });
          }
        );

        // jwt.sign(payload, refreshSecret, { expiresIn: refreshTokenLife }, (err, RefreshToken) => {
        //   res.status(200).json({
        //     success: true,
        //     RefreshToken: `Bearer ${RefreshToken}`,
        //     user: {
        //       id: user.id,
        //       firstName: user.firstName,
        //       lastName: user.lastName,
        //       email: user.email,
        //       role: user.role,
        //     },
        //   });
        // });
      } else {
        res.status(400).json({
          success: false,
          error: "Password Incorrect",
        });
      }
    });
  });
});

router.post("/register", async (req, res) => {
  try {
    const user = new User(Object.assign(req.body));
    const email = user.email;
    const role = user.role;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "That email address is already in use." });
    }

    console.log("first");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    console.log(user.role);
    if (role) {
      user.role = role;
    }
    console.log(user.role);

    console.log("first");
    const registeredUser = await user.save();
    const payload = {
      id: registeredUser._id,
    };

    const token = jwt.sign(payload, accessSecret, {
      expiresIn: accessTokenLife,
    });

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      message: `User has been registered successfully!`,
      user: registeredUser,
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
        msg: err.message,
      });
    }
  }
});

// update password
router.post("/reset", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!password) {
    return res.status(400).json({ error: "You must enter a password." });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err || existingUser === null) {
      return res.status(400).json({
        error: "No User found with this email.",
      });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          return res.status(400).json({
            error:
              "Your request could not be processed as entered. Please try again.",
          });
        }
        req.body.password = hash;

        existingUser.password = req.body.password;

        existingUser.save(async (err) => {
          if (err) {
            return res.status(400).json({
              error:
                "Your request could not be processed as entered. Please try again.",
            });
          }

          // await mailgun.sendEmail(existingUser.email, 'reset-confirmation');

          res.status(200).json({
            success: true,
            message:
              "Password changed successfully. Please login with your new password.",
          });
        });
      });
    });
  });
});

// get All User
router.get("/", async (req, res) => {
  try {
    const users = await (
      await User.find()
    ).filter((user) => user.isActive === true);

    res.json(users);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// update user
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const update = req.body;
    const query = { _id: userId };

    await User.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "USer has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// delete user by id
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const update = {
      isActive: false,
    };
    const query = { _id: userId };

    await User.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "User has been deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// get All roles
router.get("/roles/list", async (req, res) => {
  try {

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("byit-iam");
      //Find all documents in the customers collection:
      dbo.collection("roles").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      });
    });

    
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again..//.",
        msg: err.message,
      });
    }
  }
});

module.exports = router;
