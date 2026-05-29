const node_config = require("../conf/node_conf.js");

const { decrypt } = require("../opers/encdec_rsa.js");

class Receiving {

    async get_curent_url() {
        try {
            const current_urls = [];
            node_config.root_nodes.forEach(node => {
                console.log("NODE", node);
                axios.get(`http://${node}/api/gcurl`)
                    .then(res => {
                        return res.json({ messages:"Ok", status: 200 });
                    });
            });
        } catch (e) {
            return res.json({ messages:"Error", status: 500 });
        };
    };

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
            const enc_data = req.body.enc_data;
            const id = node_config.id;
            const pk = await db.all(`SELECT private_key FROM temp WHERE id = '${id}'`);
            // const decrypt_data = decrypt(enc_data, pk[0].private_key);
            const decrypt_data = enc_data;
            const tx_data = JSON.parse(decrypt_data);
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
};

module.exports = new Receiving();