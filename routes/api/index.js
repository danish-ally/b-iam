const router = require("express").Router();

const authRoutes = require("./auth");
const leadRoutes = require("./lead");
const employeeRoutes = require("./employee");
const distributorRoutes = require("./distributor");
const attendanceRoutes = require("./attendance");
const pincodeRoutes = require("./pincode");
const cityRoutes = require("./city");

// lead routes
router.use("/lead", leadRoutes);
// auth routes
router.use("/auth", authRoutes);
// employee routes
router.use("/employee", employeeRoutes);
// employee routes
router.use("/distributor", distributorRoutes);
// attendancee routes
router.use("/attendance", attendanceRoutes);
// pincode routes
router.use("/pincode", pincodeRoutes);
// city routes
router.use("/city", cityRoutes);

module.exports = router;
