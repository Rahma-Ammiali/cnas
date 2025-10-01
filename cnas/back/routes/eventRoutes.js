const express = require('express')
const {saveEvent,getEvent} = require('../controllers/eventController');

const router = express.Router();
router.post('/',saveEvent)
router.get('/',getEvent)

module.exports=router;