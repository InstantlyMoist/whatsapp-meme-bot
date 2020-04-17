exports.name = "chats";
exports.description = "Shows the amount of chats";

exports.run = async (client, msg, args) => {
    let chats = await client.getChats();
    msg.reply(`The bot has ${chats.length} chats open.`);
}