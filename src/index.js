// const OpenAI = require("openai")
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia, List } = require('whatsapp-web.js');



//* functions
const ai = require("./functions/ai")
const youtubeSearch = require("./functions/yt-search")
const youtbeDownload = require("./functions/yt-dl")
const reminder = require("./functions/reminder")
const weather = require("./functions/weather");
const salat = require("./functions/salat");

//* commands

const commands = [
    { command: "", action: ai, check: (message) => !message.body.toLowerCase().startsWith("/") },
    { command: "/youtube", action: youtubeSearch, check: (message) => message.body.toLowerCase().startsWith("/youtube") },
    { command: "/download", action: youtbeDownload, check: (message) => message.body.toLowerCase().startsWith("/download https://www.youtube.com") },
    { command: "/reminder", action: reminder, check: (message) => message.body.toLowerCase().startsWith("/reminder") },
    { command: "/weather", action: weather, check: (message) => message.body.toLowerCase().startsWith("/weather") },
    { command: "/salat", action: salat, check: (message) => message.body.toLowerCase().startsWith("/salat") },
];

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'ditto-bot',
        dataPath: './session-data.json'
    })
});
client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready! ✅",);
});


client.on("message", async (message) => {
    for (let i = 0; i < commands.length; i++) {
        if (commands[i].check(message)) {
            await commands[i].action(message, client, MessageMedia);
            break; 
        }
    }

    // let chat = message.getChat();
    // setTimeout(async () => {
    //     (await chat).delete()
    // }, 5000);
});


client.initialize() 