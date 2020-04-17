exports.name = "id";
exports.description = "Sends the chat id";

exports.run = (client, msg, args) => {
    msg.reply(`ID from this chat is: ${msg.from}`);
}