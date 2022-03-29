const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const Distributor = require("../../models/distributor");

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
  Distributor.find({ user: req.user._id }, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }

    res.status(200).json({
      distributors: data,
    });
  });
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
  const user = req.user;

  const distributor = new Distributor(
    Object.assign(req.body, { user: user._id })
  );

  try {
    const d1 = await distributor.save();
    res.status(200).json({
      success: true,
      message: `Distributor has been added successfully!`,
      distributor: d1,
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.....",
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
