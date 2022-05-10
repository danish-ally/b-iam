const { response } = require("express");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Attendance = require("../../models/attendance");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");

//  attendance
router.put("/", upload.single("image"), auth, async (req, res) => {
  try {
    const auth = req.user;

    const update = req.body;

    // console.log(update.timeZone);

    let todayDate = new Date();

    todayDate.toLocaleString("en-US", { timeZone: update.timeZone });

    let myDate =
      todayDate.getUTCFullYear() +
      "/" +
      (todayDate.getMonth() + 1) +
      "/" +
      todayDate.getUTCDate();

    // console.log(myDate);
    // console.log(todayDate);
    // console.log(update.image);

    const attendances = await await Attendance.find({
      user: auth._id,
      date: myDate,
    });
    // console.log(attendances.length);

    if (attendances.length === 0) {
      console.log("No check in");
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log(result);
      const attendance = new Attendance(
        Object.assign(
          req.body,
          { user: auth._id },
          { isOnline: true },
          { date: myDate },
          { checkIn: todayDate },
          { img: result.secure_url },
          { cloudinary_id: result.public_id }
        )
      );
      const a1 = await attendance.save();
      res.status(200).json({
        success: true,
        message: `CheckIn successfully!`,
        attendace: a1,
      });
    }

    if (attendances.length === 1) {
      console.log("No check out");
      const attendance = new Attendance(
        Object.assign(
          req.body,
          { user: auth._id },
          { isOnline: false },
          { checkout: todayDate },
          { date: myDate }
        )
      );
      const a1 = await attendance.save();
      res.status(200).json({
        success: true,
        message: `CheckOut successfully!`,
        attendace: a1,
      });
    }

    if (attendances.length === 2) {
      console.log("Already done");
      res.status(403).json({
        error: "Already give attendance for today",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// get All attendance by user Id
router.get("/list/:id", async (req, res) => {
  try {
    const attendances = await (
      await Attendance.find({ user: req.params.id }).sort({ created: -1 })
    ).filter((attendace) => attendace.isActive === true);

    res.json(attendances);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// get online status
router.get("/status/:id", async (req, res) => {
  try {
    // const auth = req.user;
    console.log("object");

    let todayDate = new Date();

    // todayDate.toLocaleString("en-US", { timeZone: update.timeZone });

    let myDate =
      todayDate.getUTCFullYear() +
      "/" +
      (todayDate.getMonth() + 1) +
      "/" +
      todayDate.getUTCDate();

    // console.log(myDate);
    // console.log(todayDate);
    // console.log(update.image);

    const attendances = await await Attendance.find({
      user: req.params.id,
      date: myDate,
    });

    let status = false;
    if (attendances.length === 0) {
      res.status(200).json({
        success: true,
        isOnline: status,
      });
    }

    if (attendances.length === 1) {
      status = true;
      res.status(200).json({
        success: true,
        isOnline: status,
      });
    }

    if (attendances.length === 2) {
      res.status(200).json({
        success: true,
        isOnline: status,
      });
    }
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

module.exports = router;
