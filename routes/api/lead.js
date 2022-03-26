const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Lead = require("../../models/lead");

// get All lead
router.get("/", async (req, res) => {
  try {
    const leads = await (
      await Lead.find()
    ).filter((lead) => lead.isActive === true);

    res.json(leads);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// get lead by id
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    res.json(lead);
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
  const user = req.user;

  const lead = new Lead(Object.assign(req.body));

  try {
    const l1 = await lead.save();
    res.status(200).json({
      success: true,
      message: `Lead has been added successfully!`,
      lead: l1,
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// update lead
router.put("/:id", async (req, res) => {
  try {
    const leadId = req.params.id;
    const update = req.body;
    const query = { _id: leadId };

    await Lead.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Lead has been updated successfully!",
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
