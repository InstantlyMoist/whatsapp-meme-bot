exports.run = (client, msg, args) => {
    let side = Math.random() >= 0.5 ? "heads" : "tails";
    msg.reply(`The coin landed on ${side}`);
}