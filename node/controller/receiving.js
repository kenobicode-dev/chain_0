const node_config = require("../conf/node_conf.js");

class Receiving {

    async gnpk(req, res, next) {
        try {
            const id = node_config.id;
            const cpk = await db.all(`SELECT external FROM temp WHERE id = '${id}'`);
            console.log("cpk", cpk);
            
            return res.json(cpk);
        } catch (e) {
            next(e);
        };
    };

    async acceptance(req, res, next) {
        try {
            const { data } = req.body;
            console.log("data", data);
            
            return res.json({});
        } catch (e) {
            next(e);
        };
    };
};

module.exports = new Receiving();