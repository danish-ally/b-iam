const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const auth = require("../../middleware/auth");
const User = require("../../models/user");
const key = require("../../config/key");
const role = require("../../helpers/role");

const { accessSecret, accessTokenLife, refreshSecret, refreshTokenLife } =
  key.jwt;

router.post("/new", auth, async (req, res) => {
  const auth = req.user;
  const email = req.body.email;
  const empCode = req.body.empCode;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = lastName + empCode;
  const password = req.body.password;
  const createdBy = auth.id;
  console.log(createdBy);

  try {
    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }
    if (!empCode) {
      return res.status(400).json({ error: "You must enter an code" });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ error: "You must enter your full name." });
    }

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }
    console.log("first");

    const existingCode = await User.findOne({ empCode });

    if (existingCode) {
      return res.status(400).json({ error: "That code is already in use." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "That email address is already in use." });
    }

    const emp = new User({
      email,
      empCode,
      password,
      firstName,
      lastName,
      username,
      createdBy,
      role: role.Employee,
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(emp.password, salt);

    emp.password = hash;
    const registeredUser = await emp.save();

    const payload = {
      id: registeredUser._id,
    };

    const token = jwt.sign(payload, accessSecret, {
      expiresIn: accessTokenLife,
    });

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      employee: {
        id: registeredUser.id,
        code: registeredUser.code,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        username: registeredUser.username,
        email: registeredUser.email,
        role: registeredUser.role,
        createdBy,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// fetch all employees api
router.get("/", auth, async (req, res) => {
  try {
    const employees = await (
      await User.find()
    ).filter((user) => user.role === "ROLE_EMPLOYEE" && user.isActive === true);

    res.json(employees);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// get Emp by id
router.get("/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employeeDoc = await User.findOne({ _id: employeeId });

    if (!employeeDoc) {
      res.status(404).json({
        message: `Cannot find Employee with the id: ${employeeId}.`,
      });
    }

    res.status(200).json({
      employee: employeeDoc,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// update emp
router.put("/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const update = req.body;
    const query = { _id: employeeId };

    await User.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Employee has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// delete emp by id
router.delete("/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const update = {
      isActive: false,
    };
    const query = { _id: employeeId };

    await User.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Employee has been deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// assign pincode
router.put("/assigned/pincode/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const update = req.body;
    const query = { _id: employeeId };

    await User.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Successfully assiggned pincode!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// clear assign pincode
router.put("/assigned/pincode/clear/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const update = {
      assignedPincode: [],
    };
    const query = { _id: employeeId };

    await User.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Successfully cleared assiggned pincode!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

module.exports = router;
