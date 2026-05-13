const crypto = require("crypto");

function rsa() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
        }
    });

    return {
        public_key: publicKey,
        private_key: privateKey
    };
};

module.exports = rsa;