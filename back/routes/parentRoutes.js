const express = require("express");
const {getParentByChild} = require("../controllers/parentController");

const router = express.Router();
router.get("/:enfantId",getParentByChild);
module.exports = router;