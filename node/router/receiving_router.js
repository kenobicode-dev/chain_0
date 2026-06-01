const Router = require("express");
const router = new Router();

const receiving = require("../controller/receiving.js");

router.get('/gnpk', receiving.gnpk);
router.post('/acceptance', receiving.acceptance);
router.get('/gcurl', receiving.gcurl);
router.post('/incoming_new_node', receiving.seve_incoming_node);

module.exports = router;