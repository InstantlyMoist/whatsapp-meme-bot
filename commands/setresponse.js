let responses = require('./../responses.json');
let fs = require('fs');

exports.run = async (client, msg, args) => {
    if (args.length == 0) {
        msg.reply("Please consider adding a response")
        return;
    }
    let quotedMessage = await msg.getQuotedMessage();
    if (quotedMessage == null || quotedMessage == undefined) {
        msg.reply("Please consider quoting a message.");
        return;
    }
    if (quotedMessage.hasMedia) responses["media"][quotedMessage.clientUrl] = args.join(" ").trim();
    else responses["text"][quotedMessage.body.toLowerCase()] = args.join(" ").trim();
    let data = JSON.stringify(responses);
    fs.writeFileSync('./responses.json', data);
    return;
}