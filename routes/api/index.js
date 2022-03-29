const router = require("express").Router();

const authRoutes = require("./auth");
const leadRoutes = require("./lead");
const employeeRoutes = require("./employee");
const distributorRoutes = require("./distributor");

// lead routes
router.use("/lead", leadRoutes);
// auth routes
router.use("/auth", authRoutes);
// employee routes
router.use("/employee", employeeRoutes);

// employee routes
router.use("/distributor", distributorRoutes);


module.exports = router;
