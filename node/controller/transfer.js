const axios = require("axios");
const node_config = require("../conf/node_conf.js");
const rsa = require("../algs/rsa.js");

class Transfer {
    async sending(tx) {
        try {
            node_config.root_nodes.forEach(node => {
                const get_npk = axios.get(`http://${node}/api/gnpk`);

                console.log("get_npk", get_npk);
                
            });
        } catch (e) {
            console.log("Transfer => sending", e);
        };
    };
};

module.exports = new Transfer();