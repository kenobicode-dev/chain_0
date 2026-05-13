const { isEqual } = require("lodash");
const sha_256 = require("js-sha256");
const bcrypt = require("bcrypt");
const peer_transform = require("../transform/peer_transform.js");
const create_rsa = require("../opers/create_rsa.js");
const transfer = require("../controller/transfer.js");

class Auth {
    async registration(req, res, next) {
        try {
            const { name, secrets } = req.body.data;
            let result;
            const peer_list = await db.all(`SELECT name FROM peers WHERE name = '${name}'`);
            if (peer_list && Boolean(peer_list.length)) {
                result = { type: "Error name", message: "Peer name already exists" };
            } else {
                try {
                    const curr_balance = 0;
                    const ts = new Date();
                    const tx_data = {
                        name: name,
                        secrets: sha_256(JSON.stringify(secrets)),
                        peer_address: await sha_256(await bcrypt.hash((name + sha_256(JSON.stringify(secrets)) + ts), 3)),
                        tx_time_stamp: ts,
                    };
                    const current_tx = { ...tx_data, tx_hash: sha_256(JSON.stringify(tx_data)), peer_balance: curr_balance };
                    create_rsa(sha_256(JSON.stringify(tx_data.peer_address)));
                    await db.all(
                        `INSERT INTO peers (name, secrets, peer_address, tx_hash, tx_time_stamp, peer_balance) 
                        VALUES (
                            ${JSON.stringify(current_tx.name)}, 
                            ${JSON.stringify(current_tx.secrets)}, 
                            ${JSON.stringify(current_tx.peer_address)}, 
                            ${JSON.stringify(current_tx.tx_hash)}, 
                            ${JSON.stringify(current_tx.tx_time_stamp)},
                            ${JSON.stringify(current_tx.peer_balance)}
                        )`
                    );
                    transfer.sending({ data: current_tx });
                    result = { type: "Ok", message: "Peer saved" };
                } catch (error) {
                    result = { type: "Error", message: "Peer registration error" };
                };
            };
            return res.json(result);
        } catch (e) {
            next(e);
        };
    };

    async login(req, res, next) {
        try {
            const { name, secrets } = req.body.data;
            let peer;
            let result;
            const peer_list = await db.all(`SELECT * FROM peers WHERE name = '${name}'`);
            if (peer_list && peer_list.length) {
                peer = peer_list.find(p => p.name === name && isEqual(p.secrets, sha_256(JSON.stringify(secrets))));
            };
            if (peer && peer.secrets) {
                result = peer_transform(peer);
            };
            if (!result) {
                result = { type: "Error", message: "Login error" };
            };
            return res.json(result);
        } catch (e) {
            next(e);
        };
    };

    async logout(req, res, next) {
        try {
            return res.json({});
        } catch (e) {
            next(e);
        };
    };
};

module.exports = new Auth();