exports.name = "ping";
exports.description = "pong!";

exports.run = (client, msg, args) => {
    msg.reply("pong!");
}