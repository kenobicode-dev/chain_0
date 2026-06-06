
class Receiving {
    async nodes_list(req, res, next) {
        try {
            const nodes = await db.all(`SELECT * FROM nodes_list`);
            return res.json(nodes);
        } catch (e) {
            next(e);
        };
    };

    async keys_list(req, res, next) {
        try {
            const nodes = await db.all(`SELECT id, public_key FROM temp`);
            return res.json(nodes);
        } catch (e) {
            next(e);
        };
    };
};

module.exports = new Receiving();