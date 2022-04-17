const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Attendance = require("../../models/attendance");

// get All Attendance
router.get("/", async (req, res) => {
  try {
    const attendances = await (
      await Attendance.find()
    ).filter((attendance) => attendance.isActive === true);

    res.json(attendances);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// get attendace by id
router.get("/:id", async (req, res) => {
  try {
    const attendace = await Attendance.findById(req.params.id);
    res.json(attendace);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// checkIn attendance
router.post("/", auth, async (req, res) => {
  const auth = req.user;

  let checkInTime = new Date().toLocaleString("en-US", {
    timeZone: req.body.timezone,
  });

  console.log(checkInTime);

  let date_nz = new Date(checkInTime);

  const attendance = new Attendance(
    Object.assign(
      req.body,
      { user: auth._id },
      { isOnline: true },
      { checkIn: date_nz }
    )
  );

  //   const currDate = Date.now().toLocaleString();
  //   console.log(attendance.checkIn.getDate());
  //   console.log(attendance.checkIn.getFullYear());
  //   console.log(attendance.checkIn.getMonth() + 1);
  //   console.log(currDate);

  // try {
  const a1 = await attendance.save();
  res.status(200).json({
    success: true,
    message: `CheckIn successfully!`,
    attendace: a1,
  });
  // } catch (err) {
  //   if (err) {
  //     return res.status(400).json({
  //       error: "Your request could not be processed. Please try again.",
  //     });
  //   }
  // }
});

// checkOut attendance
router.put("/", auth, async (req, res) => {
  try {
    const auth = req.user;

    let checkInTime = new Date().toLocaleString("en-US", {
      timeZone: req.body.timezone,
    });

    console.log(checkInTime);

    let date_nz = new Date(checkInTime);

    const attendanceCheck = await Attendance.findByDateAndUser(
      checkInTime,
      auth
    );

    if (attendanceCheck) {
      if (attendanceCheck.checkIn) {
        if (attendanceCheck.checkOut) {
          res.status(403).json({
            error: "Already given",
          });
        }else{
            
        }
      }
    }

    const attendance = new Attendance(
      Object.assign(
        req.body,
        { user: auth._id },
        { isOnline: true },
        { checkIn: date_nz }
      )
    );

    await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        checkOut: Date.now(),
        isOnline: false,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "checkOut successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// delete lead by id
router.delete("/:id", async (req, res) => {
  try {
    const leadId = req.params.id;
    const update = {
      isActive: false,
    };
    const query = { _id: leadId };

    await Lead.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Lead has been deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

module.exports = router;
