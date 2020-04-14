let responses = require('./../responses.json');
let fs = require('fs');

exports.run = async (client, msg, args) => {
    let quotedMessage = await msg.getQuotedMessage();
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