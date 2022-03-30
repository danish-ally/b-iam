const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Store = require("../../models/store");

// get All city
router.get("/", auth, async (req, res) => {
  try {
    const stores = await (
      await Store.find()
    ).filter((store) => store.isActive === true);

    res.json(stores);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// get stores by id
router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    res.json(store);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

// Add store
router.post("/", auth, async (req, res) => {
  const user = req.user;

  const store = new Store(Object.assign(req.body, { user: user._id }));

  try {
    const s1 = await store.save();
    res.status(200).json({
      success: true,
      message: `Store has been added successfully!`,
      store: s1,
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.....",
      });
    }
  }
});

// update store
router.put("/:id", async (req, res) => {
  try {
    const storeId = req.params.id;
    const update = req.body;
    const query = { _id: storeId };

    await Store.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Store has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// delete store by id
router.delete("/:id", async (req, res) => {
  try {
    const storeId = req.params.id;
    const update = {
      isActive: false,
    };
    const query = { _id: storeId };

    await Store.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Store has been deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// get All store by user Id
router.get("/list/:id", auth, async (req, res) => {
  try {
    const stores = await (
      await Store.find({ user: req.params.id })
    ).filter((store) => store.isActive === true);

    res.json(stores);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
});

module.exports = router;
