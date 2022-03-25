const router = require("express").Router();

const authRoutes = require("./auth");
const leadRoutes = require("./lead");

// lead routes
router.use("/lead", leadRoutes);
// auth routes
router.use("/auth", authRoutes);

module.exports = router;
