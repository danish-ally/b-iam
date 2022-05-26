const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const City = require("../../models/city");

// get All city
router.get("/", async (req, res) => {
  try {
    const cities = await (
      await City.find()
    ).filter((city) => city.isActive === true);

    res.json(cities);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});
// Add city
router.post("/", async (req, res) => {
  const city = new City(Object.assign(req.body));

  // try {
  const c1 = await city.save();
  res.status(200).json({
    success: true,
    message: `City has been added successfully!`,
    city: c1,
  });
  // } catch (err) {
  //   if (err) {
  //     return res.status(400).json({
  //       error: "Your request could not be processed. Please try again.",
  //     });
  //   }
  // }
});

module.exports = router;
