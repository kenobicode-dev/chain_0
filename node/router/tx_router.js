const Router = require("express");
const router = new Router();

const txController = require("../controllers/txController.js");

router.post('/registration', txController.registration);
router.post('/login', txController.login);

module.exports = router;