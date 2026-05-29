const axios = require("axios");
const crypto = require("crypto");

const node_config = require("../conf/node_conf.js");

const { encrypt } = require("../opers/encdec_rsa.js");

class Transfer {
    async sending(tx) {
        node_config.root_nodes.forEach(node => {
            axios.get(`http://${node}/api/gnpk`)
                .then(res => {
                    // const enc_data = encrypt(JSON.stringify(tx), res.data[0].public_key); WITHOUT CRYPT
                    const enc_data = JSON.stringify(tx);
                    axios.post(`http://${node}/api/acceptance`, { enc_data })
                        .then(enc_res => {
                            return JSON.stringify({ messages:"Ok", status: 200 })
                        })
                        .catch(e => {
                            return JSON.stringify({ messages:"Error", error: e.response })
                        });
                })
                .catch(error => {
                    return JSON.stringify({ messages:"Error", status: 500 })
                })
        });

    };
};
module.exports = new Transfer();