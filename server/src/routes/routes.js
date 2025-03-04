const express = require('express');

const userRoute = require('./userRoute.js');
const mediaRoute = require('./mediaRoute');
const reviewRoute = require('./reviewRoute');

const router = express.Router();

router.use("/user", userRoute);
router.use("/:mediaType", mediaRoute);
router.use("/reviews", reviewRoute);


module.exports = router;