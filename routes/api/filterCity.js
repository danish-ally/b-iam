const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const FilterCity = require("../../models/filterCity");

// get All city
router.get("/", async (req, res) => {
  try {
    const filterCities = await (
      await FilterCity.find()
    ).filter((filterCity) => filterCity.isActive === true);

    res.json(filterCities);
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
  const city = new FilterCity(Object.assign(req.body));

  // try {
  const c1 = await city.save();
  res.status(200).json({
    success: true,
    message: `City has been added successfully!`,
    filterCity: c1,
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
