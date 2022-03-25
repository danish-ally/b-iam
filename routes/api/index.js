const router = require('express').Router();

const leadRoutes = require('./lead');

// lead routes
router.use('/lead', leadRoutes);

module.exports = router;
