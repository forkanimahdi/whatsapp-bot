const youtubesearchapi = require("youtube-search-api");


module.exports = async function youtubeSearch(message, client) {


    let search = message.body.slice(9);
    await client.sendMessage(message.from, "Please wait ⏳ ...")

    try {
        console.log(search);
        const response = await youtubesearchapi.GetListByKeyword(search, false, 5);
        const youtubeLinks = response.items.map((item, index) => item.length && `
            ${index + 1} - ${item.title} 
            Artist: ${item.channelTitle} 
            Duration:  ${item.length ? item.length.simpleText : "Channel"} 
            Link: https://www.youtube.com/watch?v=${item.id}
        `);

        const youtubeSuggestion = youtubeLinks.join("\n");
        client.sendMessage(message.from, youtubeSuggestion);
        await message.getChat().delete()

    } catch (error) {

        console.log(error);


    }

}