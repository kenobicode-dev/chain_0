const Router = require("express");
const router = new Router();

const receiving = require("../controller/receiving.js");

router.get('/gnpk', receiving.gnpk);
router.post('/acceptance', receiving.acceptance);
router.get('/gcurl', receiving.gcurl);

module.exports = router;