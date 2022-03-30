const router = require("express").Router();

const authRoutes = require("./auth");
const leadRoutes = require("./lead");
const employeeRoutes = require("./employee");
const distributorRoutes = require("./distributor");
const cityRoutes = require("./city");
const stateRoutes = require("./state");
const storeRoutes = require("./store");

// lead routes
router.use("/lead", leadRoutes);
// auth routes
router.use("/auth", authRoutes);
// employee routes
router.use("/employee", employeeRoutes);
// employee routes
router.use("/distributor", distributorRoutes);
// city routes
router.use("/city", cityRoutes);
// state routes
router.use("/state", stateRoutes);
// store routes
router.use("/store", storeRoutes);

module.exports = router;
