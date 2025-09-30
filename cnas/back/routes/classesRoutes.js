const express = require("express")
const {ajouterCapaciteClasses} = require("../controllers/classesController")

const router = express.Router()
router.post('/',ajouterCapaciteClasses);

module.exports = router;