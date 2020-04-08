let { Client, MessageMedia } = require('whatsapp-web.js');
let fs = require('fs');
let fetch = require('node-fetch');
let Jimp = require("jimp");
let request = require('request');
const { readFile } = require('fs');
const { promisify } = require('util');
let keys = require('./key.json');
let readFileAsync = promisify(readFile);

const SESSION_FILE_PATH = "./session.json";
let sessionConfig;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionConfig = require(SESSION_FILE_PATH);
}

let client = new Client({ session: sessionConfig });

let express = require("express");
let qrcode = require('qrcode-terminal');


client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

let possible = [
    "mijn fiets is lek",
    "wifi over de kabel is gratis",
    "mijn fiets is lek"
];

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
    if (msg.body == '!bart') {
        msg.reply(possible[Math.floor(Math.random() * possible.length)]);
    }
    if (msg.body == '!meme') {
        sendMeme(msg);
    }
    if (msg.body == '!rik') {
        msg.reply("WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH");
    }
    if (msg.body.toLowerCase().includes("herres")) {
        msg.reply("HAHAHAHAHAHA, HIJ ZEI HERRES!");
    }
    if (msg.body.toLowerCase().startsWith("!fortnite")) {
        let split = msg.body.split(" ");
        if (split.length == 1) {
            msg.reply("Specificeer een gebruikersnaam!");
            return;
        }
        sendStats(msg, msg.body.replace("!fortnite ", ""));
    }
});

async function sendStats(msg, playerName) {
    let response = await fetch(`https://api.fortnitetracker.com/v1/profile/pc/${playerName}`, {
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
    msg.reply(`Statistieken voor ${playerName}:\n\n${statsString}`);
}

async function sendMeme(msg) {
    let newMeme = await getMemeJSON();
    downloadImageFromUrl(newMeme.url, async (success) => {
        if (!success) return;
        var imageAsBase64 = fs.readFileSync('./meme.jpg', 'base64');
        var mm = new MessageMedia("image/jpg", imageAsBase64);
        client.sendMessage(msg.from, mm, { caption: newMeme.title });
    });
}

async function getMemeJSON() {
    let response = await fetch('http://meme-api.herokuapp.com/gimme');
    let data = await response.json();
    return data;
}

async function convertMeme() {
    Jimp.read("./meme.png", function (err, image) {
        image.scaleToFit(512, 512).write("./meme.jpg");
    });
}

async function downloadImageFromUrl(url, callback) {
    let extension = url.endsWith("png") ? "png" : "jpg";
    request.head(url, (err, body) => {
        if (err) return callback(false);
        request(url).pipe(fs.createWriteStream(`./meme.${extension}`)).on('close', () => {
            if (extension === "png") convertMeme();
            return callback(true);
        })
    })
}

client.initialize();
