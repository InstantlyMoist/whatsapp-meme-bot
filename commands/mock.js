let msb = require("./../msbcreator.js");

exports.name = "mock";
exports.description = "Mocks a quoted message";

exports.run = async (client, msg, args) => {
    let quotedMessage = await msg.getQuotedMessage();
    if (quotedMessage == null || quotedMessage == undefined) {
        msg.reply("Please consider quoting a message.");
        return;
    }
    msb.sendMock(client, msg, quotedMessage.body.split(" "));

}