let Jimp = require("jimp");
let request = require('request');
let fs = require('fs');
let fetch = require('node-fetch');
let MessageMedia;

exports.name = "meme";
exports.description = "Sends a meme";

exports.run = async (client, msg, args) => {
    MessageMedia = client.messagemedia;
    let newMeme = await getMemeJSON();
    downloadImageFromUrl(newMeme.url, async (success) => {
        if (!success) return;
        var imageAsBase64 = await fs.readFileSync('./meme.jpg', 'base64');
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
    request(url).pipe(fs.createWriteStream(`./meme.${extension}`)).on('close', () => {
        if (extension === "png") convertMeme();
        return callback(true);
    })
}
