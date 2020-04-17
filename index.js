let { Client, MessageMedia } = require('whatsapp-web.js');
let fs = require('fs');
let Enmap = require('enmap');
let responses = require('./responses.json');
let qrcode = require('qrcode-terminal');
let data = require("./data/data.json");
let admins = require("./data/admins.json");

const SESSION_FILE_PATH = "./session.json";
let sessionConfig;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionConfig = require(SESSION_FILE_PATH);
}

let client = new Client({ session: sessionConfig });
client.commands = new Enmap();
client.messagemedia = MessageMedia;


fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('authenticated', (session) => {
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});


client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {   
    if (data.timeout > Date.now() && (!admins.admins.includes(msg.author) && !admins.admins.includes(msg.from))) return;
    if (msg.body.indexOf('!') !== 0) {
        let possibleResponse = msg.hasMedia ? responses['media'][msg.clientUrl] : responses['text'][msg.body.toLowerCase()];
        if (possibleResponse != null) msg.reply(possibleResponse);
        return;
    }
    const args = msg.body.slice('!'.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, msg, args);
});

client.initialize();
