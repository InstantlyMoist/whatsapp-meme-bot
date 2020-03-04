let { Client, MessageMedia } = require('whatsapp-web.js');
let fs = require('fs');
let fetch = require('node-fetch');
let Jimp = require("jimp");
let request = require('request');
const { readFile } = require('fs');
const { promisify } = require('util');
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
        msg.downloadMedia();
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
});

async function sendMeme(msg) {
    let newMeme = await getMemeJSON();
    downloadImageFromUrl(newMeme, async (success) => {
        if (!success) return;
        var imageAsBase64 = fs.readFileSync('./meme.jpg', 'base64');
        var mm = new MessageMedia("image/jpg",imageAsBase64);
        msg.reply(mm)
    });
}

async function getMemeJSON() {
    let response = await fetch('http://meme-api.herokuapp.com/gimme');
    let data = await response.json();
    return data.url;
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

//TODO: split this shit
