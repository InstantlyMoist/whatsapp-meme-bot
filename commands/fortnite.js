let fetch = require('node-fetch');
let keys = require('./../key.json');

exports.name = "fortnite";
exports.description = "Sends the fortnite statistics from a given player";

exports.run = async (client, msg, args) => {
    if (args.length == 0) {
        msg.reply("Please specify an username.");
        return;
    }
    let response = await fetch(`https://api.fortnitetracker.com/v1/profile/pc/${args[0]}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "TRN-Api-Key": keys.fortnite,
        },
        credentials: "same-origin"
    });
    let body = await response.json();
    let statsString = "";
    for (let stat in body.lifeTimeStats) {
        statsString += `${body.lifeTimeStats[stat].key} : ${body.lifeTimeStats[stat].value}\n`;
    }
    msg.reply(`Statistics for ${args[0]}:\n\n${statsString}`);

}