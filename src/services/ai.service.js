const {GoogleGenAI}=require("@google/genai")

const ai=new GoogleGenAI({})


async function generateResponse(contents){
    const response=await ai.models.generateContent({
        model:"gemini-2.0-flash",
        contents:contents
    })


    return response.text
}

module.exports={generateResponse};