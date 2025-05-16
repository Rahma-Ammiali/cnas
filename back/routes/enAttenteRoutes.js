const express= require("express")
const {recupererInfos}= require("../controllers/enAttenteController")

const router = express.Router()
router.get("/:id",recupererInfos)

module.exports = router ;