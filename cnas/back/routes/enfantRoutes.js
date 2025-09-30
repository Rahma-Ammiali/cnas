const express = require("express");
const {getChildrenByParent} = require("../controllers/enfantController")

const router = express.Router();
router.get("/:numAssurance", getChildrenByParent);

module.exports = router;