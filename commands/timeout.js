let fs = require('fs');
let data = require("./../data/data.json");
let admins = require("./../data/admins.json");

exports.run = (client, msg, args) => {
    if (!admins.admins.includes(msg.author) && !admins.admins.includes(msg.from)) {
        msg.reply("You don't have permission to add responses");
        return;
    }
    if (args.length == 0) {
        msg.reply("Please consider adding a length");
        return;
    }
    let length = Number(args[0]);
    if (length == NaN) {
        msg.reply("Please consider giving a number");
        return;
    }
    data.timeout = Date.now() + (length * 1000);
    fs.writeFileSync("./data.json", JSON.stringify(data));
    msg.reply(`OK, Bot will ignore commands for ${length} seconds.`);
};