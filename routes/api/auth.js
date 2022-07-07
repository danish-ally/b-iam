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
        error:
          "No User found with this email.",
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


module.exports = router;
