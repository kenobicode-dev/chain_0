const node_config = require("../conf/node_conf.js");
const decrypt = require("../opers/encdec_aes.js");

class Receiving {
    async gcurl(req, res, next) {
        try {
            const node_address = await`${node_config.host}:${node_config.port}`;
            return res.json(node_address);
        } catch (e) {
            next(e);
        };
    };

    async gnpk(req, res, next) {
        try {
            const id = node_config.id;
            const cpk = await db.all(`SELECT public_key FROM temp WHERE id = '${id}'`);
            return res.json(cpk);
        } catch (e) {
            next(e);
        };
    };

    async acceptance(req, res, next) {
        try {
            const tx_data = JSON.parse(req.body.enc_data);
            const has_tx = await db.all(`SELECT * FROM peers WHERE peer_address = '${tx_data.data.peer_address}'`);
            if (!has_tx || !has_tx.length) {
                await db.all(
                    `INSERT INTO peers (name, secrets, peer_address, tx_hash, tx_time_stamp, peer_balance) 
                    VALUES (
                        ${JSON.stringify(tx_data.data.name)}, 
                        ${JSON.stringify(tx_data.data.secrets)}, 
                        ${JSON.stringify(tx_data.data.peer_address)}, 
                        ${JSON.stringify(tx_data.data.tx_hash)}, 
                        ${JSON.stringify(tx_data.data.tx_time_stamp)},
                        ${JSON.stringify(tx_data.data.peer_balance)}
                    )`
                );
            }
            return res.json({ messages: `New Tx: ${tx_data.data.tx_time_stamp}` });
        } catch (e) {
            next(e);
            return res.json({ messages: `New Tx Error: ${e?.data?.error || e?.data?.status}` });
        };
    };

    async seve_incoming_node(req, res, next) {
        try {
            const node_data = req.body.node_data;
            const id = node_data.id;
            const has_host = await db.all(`SELECT * FROM nodes_list WHERE id = '${id}'`);

            if (!has_host || !has_host.length) {
                await db.all(
                    `INSERT INTO nodes_list (id, host, port) 
                    VALUES (
                        ${JSON.stringify(node_data.id)}, 
                        ${JSON.stringify(node_data.host)}, 
                        ${JSON.stringify(node_data.port)}
                    )`
                );
                console.log("NEW NODE ADDED");
            }
            return res.json({ messages: `New node added: ${node_data.id}`, status: "Ok" });
        } catch (e) {
            next(e);
            return res.json({ messages: `New node Error: ${e?.data?.error || e?.data?.status}` });
        };
    };
};

module.exports = new Receiving();