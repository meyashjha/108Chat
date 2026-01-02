import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: `${GEMINI_API_KEY}` });

export const geminiGenrateContent = async (prompt)=>{
        try{
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt}`,
  });
  console.log(response.text);
  return response.text
    }catch(err){
        console.log(err)
    }
}

