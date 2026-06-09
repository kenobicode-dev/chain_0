const node_config = require("../conf/node_conf.js");

class Sessions {
    async set_session(peer_address) {
        const has_session = await db.all(`SELECT peer_address FROM sessions WHERE peer_address = '${peer_address}'`);

        if (has_session.length && has_session[0].peer_address) {
            await db.all(`DELETE FROM sessions WHERE peer_address = '${peer_address}'`);
            const ts = new Date();
            await db.all(
                `INSERT INTO sessions (peer_address, ts_start, node_id, period) 
                VALUES (
                    ${JSON.stringify(peer_address)}, 
                    ${JSON.stringify(ts)},
                    ${JSON.stringify(node_config.id)}, 
                    "600"
                )`
            );
        }
        return {}
    };

    async get_session(peer_address) {
        const has_session = await db.all(`SELECT peer_address FROM sessions WHERE peer_address = '${peer_address}'`);
        if (has_session.length && has_session[0].peer_address) {
            return { status: "Ok", session: has_session[0] };
        } else {
            return { status: "Error", session: "Seesion ID not found" };
        }
    };

    async delete_session(peer_address) {
        const has_session = await db.all(`SELECT peer_address FROM sessions WHERE peer_address = '${peer_address}'`);
        if (has_session.length && has_session[0].peer_address) {
            await db.all(`DELETE FROM sessions WHERE peer_address = '${peer_address}'`)
                .then(() => {
                    return { status: "Ok" };
                })
        }
    };
};

module.exports = new Sessions();