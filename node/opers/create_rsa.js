const rsa = require("../algs/rsa.js");

async function create_rsa(id) {
    const check_tmp = await db.all(`SELECT * FROM temp;`);
    if (!check_tmp.length) {
        const { public_key, private_key } = await rsa();
        const has_rsa = await db.all(
            `INSERT INTO temp (id, public_key, private_key) 
            VALUES (
                ${JSON.stringify(id)},
                ${JSON.stringify(public_key)},
                ${JSON.stringify(private_key)}
            )`
        );
        console.log("has_rsa", has_rsa);
        
        if (has_rsa) {
            console.log("RSA CREATED: 'OK'");
        }
    };
};

module.exports = create_rsa;