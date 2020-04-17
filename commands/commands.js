exports.name = "commands";
exports.description = "Gives you this list of commands.";

exports.run = (client, msg, args) => {
    console.log('Hello world');
    console.log(client.commands);
    let finalString = "*Commands:*\n";
    client.commands.forEach((command) => {
        finalString += `_${command.name}_ : ${command.description}\n`
    });
    msg.reply(finalString.trim());
};