let fs = require('fs');
let data = require("./../data/data.json");
let admins = require("./../data/admins.json");

exports.run = (client, msg, args) => {
    if (!admins.admins.includes(msg.author) && !admins.admins.includes(msg.from)) {
        msg.reply("You don't have permission to add responses");
        return;
    }
    data.timeout = Date.now();
    fs.writeFileSync("./data.json", JSON.stringify(data));
    msg.reply("OK, Bot will reply again.");
};