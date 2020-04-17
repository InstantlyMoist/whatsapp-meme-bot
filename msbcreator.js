let { registerFont, createCanvas, loadImage } = require('canvas')
let fs = require('fs')

let MessageMedia;

const HEIGHT = 376;
const WIDTH = 500;

let sendMock = (client, msg, args) => {
    MessageMedia = client.messagemedia;
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')
    registerFont('./assets/impact.ttf', {family: 'Impact'});
    ctx.font = '30px Impact'

    let finalText = randomizeCaps(args.join(" "));
    var textDimensions = ctx.measureText(finalText);
    if (textDimensions.width > WIDTH) {
        finalText = split(finalText);
    }

    loadImage('./assets/msb.jpg').then((image) => {
        ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);
        if (typeof finalText == "string") {
            drawText(ctx, true, finalText);
        } else {
            drawText(ctx, true, finalText["first"]);
            drawText(ctx, false, finalText["second"]);
        }

        const out = fs.createWriteStream('./assets/msb_final.jpg');
        const stream = canvas.createPNGStream()
        stream.pipe(out);
        stream.on('end', async () => {
            var imageAsBase64 = await fs.readFileSync('./assets/msb_final.jpg', 'base64');
            var mm = new MessageMedia("image/jpg", imageAsBase64);
            client.sendMessage(msg.from, mm, { caption: "jUsT FucK oFf" });
        });
    })
}

let randomizeCaps = (text) => {
    let finalText = "";
    for (let index in text.split("")) {

        let letter = text[index];
        var shouldBeUpper = Math.random() >= 0.5;
        finalText += shouldBeUpper ? letter.toUpperCase() : letter.toLowerCase();
    }
    return finalText;
}

let split = (text) => {
    let middle = Math.floor(text.length / 2);
    let before = text.lastIndexOf(' ', middle);
    let after = text.indexOf(' ', middle + 1);
    middle = middle - before < after - middle ? before : after;
    let first = text.substr(0, middle);
    let second = text.substr(middle + 1);
    return ({ first, second });
}

let drawText = (ctx, top, text) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    let textDimensions = ctx.measureText(text);
    ctx.fillText(text, WIDTH / 2 - textDimensions.width / 2, top ? 40 : HEIGHT - 30);
    ctx.strokeText(text, WIDTH / 2 - textDimensions.width / 2, top ? 40 : HEIGHT - 30);
}

exports.sendMock = sendMock;