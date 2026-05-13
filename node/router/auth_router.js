const Router = require("express");
const router = new Router();

const auth = require("../controller/auth.js");

router.post("/registration", auth.registration);
router.post("/login", auth.login);
router.post("/logout", auth.logout);

module.exports = router;