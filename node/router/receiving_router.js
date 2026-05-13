const Router = require("express");
const router = new Router();

const receiving = require("../controller/receiving.js");

router.get('/gnpk', receiving.gnpk);
router.post('/new_registration', receiving.acceptance);

module.exports = router;