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

// get city by id
router.get("/:id", async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    res.json(city);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// Add lead
router.post("/", async (req, res) => {
  const city = new City(Object.assign(req.body));

  try {
    const c1 = await city.save();
    res.status(200).json({
      success: true,
      message: `City has been added successfully!`,
      city: c1,
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again...",
      });
    }
  }
});

// update city
router.put("/:id", async (req, res) => {
  try {
    const cityId = req.params.id;
    const update = req.body;
    const query = { _id: cityId };

    await City.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "City has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// delete city by id
router.delete("/:id", async (req, res) => {
  try {
    const cityId = req.params.id;
    const update = {
      isActive: false,
    };
    const query = { _id: cityId };

    await City.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "City has been deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// get All city by state Id
router.get("/list/:id", async (req, res) => {
    try {
        const cities = await (
          await City.find({ state: req.params.id })
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

module.exports = router;
