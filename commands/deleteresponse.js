let responses = require('./../responses.json');
let fs = require('fs');
let admins = require("./../data/admins.json");

exports.run = async (client, msg, args) => {
    let quotedMessage = await msg.getQuotedMessage();
    if (!admins.admins.includes(msg.author) && !admins.admins.includes(msg.from)) {
        msg.reply("You don't have permission to remove responses");
        return;
    }
    if (quotedMessage == null || quotedMessage == undefined) {
        msg.reply("Please consider quoting a message.");
        return;
    }
    if (quotedMessage.hasMedia) responses["media"][quotedMessage.clientUrl] = null;
    else responses["text"][quotedMessage.body.toLowerCase()] = null;
    let data = JSON.stringify(responses);
    fs.writeFileSync('./responses.json', data);
    return;
}