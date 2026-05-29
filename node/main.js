const express = require("express");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite_3 = require("sqlite3");
const sha_256 = require("js-sha256");
const axios = require("axios");

const create_rsa = require("./opers/create_rsa.js");
const db_generate = require("./conf/db_conf.js");
const node_config = require("./conf/node_conf.js");
const auth_router = require("./router/auth_router.js");
const receiving_router = require("./router/receiving_router.js");


const os = require("os");
const app = express();

app.use(express.json());

app.use(cors({
  credentials: false,
  origin: "*",
}));

app.use("/api", auth_router);
app.use("/api", receiving_router);

// async function get_curent_url() {
//   try {
//     const current_urls = [];
//     node_config.root_nodes.forEach(node => {
//       axios.get(`http://${node}/api/gcurl`)
//         .then(res => {
//           // console.log("RES", res.data);
          
//           node_config.root_nodes.push(res.data);
//         })
//         .catch(() => {
//           return { message: "error" };
//         })
//     });
//   } catch (e) {
//     // console.log("get_curent_url => get", e);
//   };
// };

async function set_id() {
  if (!node_config.id || node_config.id == "") {
    const node_id = await sha_256(JSON.stringify(node_config));
    node_config.id = node_id;
  }
}

open({
  filename: 'node/db/data.db',
  driver: sqlite_3.Database
}).then((db) => {
  global.db = db;
  set_id();
  console.log("DATABASE CONNECTED... 'OK'");
  console.log("--------------------------");
  db_generate()
    .then(res => {
      if (res.status === "ok") {
        create_rsa(node_config.id);
      }
    });
  start_node();
})
  .catch((e) => {
    console.log("DATABASE CONNECTED... 'ERROR'", e);
  });

async function start_node() {
  try {    
    app.listen(node_config.port, () => {
      console.log("NODE STARTED... 'OK'");
      console.log("CONFIG:");
      Object.entries(node_config).forEach(([k, v]) => {
        console.log(`${k}: ${v}`);
      });
      console.log("--------------------------");
    });
  } catch (error) {
    // console.log("NODE CRASH... 'ERROR'", error);
  };
};