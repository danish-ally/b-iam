const express = require("express");
const role = require("../../helpers/role");
const auth = require("../../middleware/auth");
const router = express.Router();
const Distributor = require("../../models/user");
const key = require("../../config/key");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const mailgun = require("../../services/mailgun");

const { accessSecret, accessTokenLife, refreshSecret, refreshTokenLife } =
  key.jwt;

// get All distributor
router.get("/", auth, async (req, res) => {
  try {
    const distributors = await (
      await Distributor.find()
    ).filter((distributor) => distributor.isActive === true);

    res.json(distributors);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

//get All Distributors By User Id
router.get("/list", auth, async (req, res) => {
  try {
    const distributors = await (
      await Distributor.find({ user: req.params.id })
    ).filter((distributor) => distributor.isActive === true);

    res.json(distributors);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// get distributor by id
router.get("/:id", async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);
    res.json(distributor);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// Add distributor
router.post("/", auth, async (req, res) => {
  const auth = req.user;
  const user = new Distributor(
    Object.assign(req.body, { role: role.Distributor }, { user: auth._id })
  );
  try {
    const email = user.email;
    const password1 = user.password;

    const existingUser = await Distributor.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "That email address is already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    const registeredUser = await user.save();
    const payload = {
      id: registeredUser._id,
    };

    console.log(password1);

    await mailgun.sendEmail(
      registeredUser.email,
      password1,
      "signup",
      null,
      registeredUser
    );
    console.log("distributor");

    const token = jwt.sign(payload, accessSecret, {
      expiresIn: accessTokenLife,
    });

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      message: `Distributor has been registered successfully!`,
      distributor: registeredUser,
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// update distributor
router.put("/:id", async (req, res) => {
  try {
    const distributorId = req.params.id;
    const update = req.body;
    const query = { _id: distributorId };

    await Distributor.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Distributor has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// delete distributor by id
router.delete("/:id", async (req, res) => {
  try {
    const distributorId = req.params.id;
    const update = {
      isActive: false,
    };
    const query = { _id: distributorId };

    await Distributor.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Distributor has been deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

module.exports = router;
