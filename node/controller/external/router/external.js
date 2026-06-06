const Router = require("express");
const router = new Router();

const external = require("../controllers/external.js");

router.get("/nodes_list", external.nodes_list);
router.get("/keys_list", external.keys_list);

module.exports = router;