const axios = require("axios");
const crypto = require("crypto");

const node_config = require("../conf/node_conf.js");

const { encrypt } = require("../opers/encdec_rsa.js");

class Transfer {
    async sending(tx) {
        node_config.root_nodes.forEach(node => {
            axios.get(`http://${node}/api/gnpk`)
                .then(res => {
                    const enc_data = encrypt(JSON.stringify(tx), res.data[0].public_key);
                    // const enc_data = JSON.stringify(tx);
                    axios.post(`http://${node}/api/acceptance`, { enc_data })
                        .then(enc_res => {
                            return { messages:"Ok", status: 200 };
                        })
                        .catch(e => {
                            return { messages:"Error", error: e.response };
                        });
                })
                .catch(error => {
                    return { messages:"Error", status: 500 };
                })
        });
    };

    async send_new_node() {
        const node_data = {
            id: node_config.id,
            host: node_config.host,
            port: node_config.port
        };
        node_config.root_nodes.forEach(node => {
            axios.post(`http://${node}/api/incoming_new_node`, { node_data })
                .then(() => {
                    return { messages:"Ok", status: 200,  }
                })
                .catch(e => {
                    return { messages:"Error", error: e.response }
                });
        });
    };
};
module.exports = new Transfer();