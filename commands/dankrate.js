exports.name = "dankrate";
exports.description = "Gives you a dank rating";

exports.run = (client, msg, args) => {
    let dankrate = getRandomInt(100);
    msg.reply(`*dank r8 machine*\nYou are ${dankrate}% dank`);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}