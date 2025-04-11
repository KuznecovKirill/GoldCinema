const express = require('express');

const userRoute = require('./userRoute.js');
const mediaRoute = require('./mediaRoute');
const reviewRoute = require('./reviewRoute');
const adminRoute = require("./adminRoute");
const router = express.Router();

router.use("/user", userRoute);
router.use("/admin", adminRoute);
router.use("/medias", mediaRoute);
router.use("/reviews", reviewRoute);


module.exports = router;