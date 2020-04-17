let msb = require("./../msbcreator.js");

exports.run = async (client, msg, args) => {
    if (args.length == 0) {
        msg.reply("Please conider adding a text");
        return;
    }
    msb.sendMock(client, msg, args);
}

