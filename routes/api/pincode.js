const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Pincode = require("../../models/pincode");

// get All pincode
router.get("/", async (req, res) => {
  try {
    const pincodes = await (
      await Pincode.find()
    ).filter((pincode) => pincode.isActive === true);

    res.json(pincodes);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// Add pincode
router.post("/", async (req, res) => {
  // const user = req.user;

  const pincode = new Pincode(Object.assign(req.body));

  try {
    const p1 = await pincode.save();
    res.status(200).json({
      success: true,
      message: `Pincode has been added successfully!`,
      pincode: p1,
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

module.exports = router;
