const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();



module.exports = async function ai(message, client) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    //* gemeni  
 
    const prompt = message.body
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(text);
    client.sendMessage(message.from, text)

}