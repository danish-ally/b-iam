const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const State = require("../../models/state");

// get All state
router.get("/", async (req, res) => {
  try {
    const states = await (
      await State.find()
    ).filter((state) => state.isActive === true);

    res.json(states);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// get state by id
router.get("/:id", async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    res.json(state);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// Add state
router.post("/", async (req, res) => {

  const state = new State(Object.assign(req.body));

  try {
    const s1 = await state.save();
    res.status(200).json({
      success: true,
      message: `State has been added successfully!`,
      state: s1,
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again...",
      });
    }
  }
});

// update state
router.put("/:id", async (req, res) => {
  try {
    const stateId = req.params.id;
    const update = req.body;
    const query = { _id: stateId };

    await State.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "State has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// delete state by id
router.delete("/:id", async (req, res) => {
  try {
    const stateId = req.params.id;
    const update = {
      isActive: false,
    };
    const query = { _id: stateId };

    await State.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "State has been deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

module.exports = router;
