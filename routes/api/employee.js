const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const auth = require("../../middleware/auth");
const User = require("../../models/user");
const key = require("../../config/key");
const role = require("../../helpers/role");
const axios = require("axios").default;

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
  const city = req.body.city;
  const phoneNo = req.body.phoneNo
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
    if (!city) {
      return res.status(400).json({ error: "You must enter a city." });
    }
    if (!phoneNo) {
      return res.status(400).json({ error: "You must enter a Phone No." });
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
      city,
      phoneNo,
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
        empCode: registeredUser.empCode,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        username: registeredUser.username,
        email: registeredUser.email,
        role: registeredUser.role,
        city: registeredUser.city,
        phoneNo: registeredUser.phoneNo,
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
  const cityName = req.query.city;
  try {
    if (!cityName) {
      const employees = await (
        await User.find()
      ).filter(
        (user) => user.role === "ROLE_EMPLOYEE" && user.isActive === true
      );
      res.json(employees);
    } else {
      const employees = await (
        await User.find({ city: cityName })
      ).filter(
        (user) => user.isActive === true && user.role === "ROLE_EMPLOYEE"
      );

      res.json(employees);
    }
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
    const userName = req.body.lastName + req.body.empCode;
    const update = {
      empCode: req.body.empCode,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: userName,
      phoneNo: req.body.phoneNo,
      city: req.body.city,
    };
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
      assignedPincode: "",
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

// get assignPincode and online status
router.get("/status/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employeeDoc = await User.findOne({ _id: employeeId });

    if (!employeeDoc) {
      res.status(404).json({
        message: `Cannot find Employee with the id: ${employeeId}.`,
      });
    }

    console.log(employeeDoc);

    if (employeeDoc.assignedPincode) {
      axios
        .get(
          `https://byit-be-iam.herokuapp.com/api/attendance/status/${employeeId}`
        )
        .then(function (response) {
          res.status(200).json({
            isOnline: response.data.isOnline,
            assignedPincode: employeeDoc.assignedPincode,
          });
        });
    } else {
      axios
        .get(
          `https://byit-be-iam.herokuapp.com/api/attendance/status/${employeeId}`
        )
        .then(function (response) {
          res.status(200).json({
            isOnline: response.data.isOnline,
          });
        });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});


module.exports = router;
