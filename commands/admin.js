let admins = require("./../data/admins.json");

exports.name = "admin";
exports.description = "Shows if you're admin or not";

exports.run = (client, msg, args) => {
    let adminString = admins.admins.includes(msg.author) || admins.admins.includes(msg.from) ? "have" : "don't have";
    msg.reply(`U ${adminString} admin privelleges`);
}