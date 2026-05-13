const nodeTables = [
    {
        name: "blocks",
        columns: [
            {
                name: "id",
                type: "INTEGER",
                null: false
            },
            {
                name: "version",
                type: "REAL",
                null: false
            },
            {
                name: "previous_block_hash",
                type: "TEXT",
                null: false
            },
            {
                name: "merkle_root",
                type: "TEXT",
                null: false
            },
            {
                name: "difficulty_target",
                type: "INTEGER",
                null: false
            },
            {
                name: "nonce",
                type: "INTEGER",
                null: false
            },
            {
                name: "time_stamp",
                type: "NUMERIC",
                null: false
            },
            {
                name: "tx_list",
                type: "TEXT",
                null: false
            }
        ]
    },
    {
        name: "tx",
        columns: [
            {
                name: "id",
                type: "INTEGER",
                null: false
            },
            {
                name: "block_id",
                type: "INTEGER",
                null: false
            },
            {
                name: "block_version",
                type: "REAL",
                null: false
            },
            {
                name: "version",
                type: "REAL",
                null: false
            },
            {
                name: "tx_hash",
                type: "TEXT",
                null: false
            },
            {
                name: "time_stamp",
                type: "NUMERIC",
                null: false
            },
            {
                name: "tx_list",
                type: "TEXT",
                null: false
            }
        ]
    },
    {
        name: "peers",
        columns: [
            {
                name: "name",
                type: "TEXT",
                null: false
            },
            {
                name: "secrets",
                type: "TEXT",
                null: false
            },
            {
                name: "tx_time_stamp",
                type: "TEXT",
                null: false
            },
            {
                name: "tx_hash",
                type: "TEXT",
                null: false
            },
            {
                name: "peer_address",
                type: "TEXT",
                null: false
            },
            {
                name: "peer_balance",
                type: "INTEGER",
                null: false,
                default: 0
            }
        ]
    },
    {
        name: "temp",
        columns: [
            {
                name: "id",
                type: "TEXT",
                null: false
            },
            {
                name: "public_key",
                type: "TEXT",
                null: false
            },
            {
                name: "private_key",
                type: "TEXT",
                null: false
            }
        ]
    }
];

async function dbConfig() {
    try {
        for (let table in nodeTables) {
            await db.all(`CREATE TABLE ${nodeTables[table].name} ( ${nodeTables[table].columns.map(c => (`${c.name} ${c.type}`)).join(",")} )`);
            console.log(`TABLES ${nodeTables[table].name.toUpperCase()}... 'OK'`);
            console.log("--------------------------");
        };
        console.log("STARTING BLOCK RECALCULATION PROCEDURE... 'OK'");

        return { status: "ok" }
    } catch (error) {
        if (error && error.errno == 1) {
            console.log("STARTING BLOCK RECALCULATION PROCEDURE... 'OK'");
        }
        return { status: "error" }
    }
};

module.exports = dbConfig;