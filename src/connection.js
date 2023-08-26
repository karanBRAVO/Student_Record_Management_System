const MONGOOSE = require("mongoose");

const URL = "mongodb://0.0.0.0:27017/myApp";

MONGOOSE.connect(URL).then(() => {
    console.log(`[+] Database created.`);
  }).catch((error) => {
    console.log(`[-] Error occured while creating database.`);
    console.log(`${error}`);
  });
