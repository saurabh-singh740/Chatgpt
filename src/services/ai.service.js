const { GoogleGenAI } = require("@google/genai")


const ai = new GoogleGenAI({})


async function generateResponse(contents) {

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
    })

    return response.contents

}

async function generateVector(content) {

    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: content,
        config: {
            outputDimensionality: 768
        }
    })

    return response.embeddings

}

module.exports = {
    generateResponse,
    generateVector
}