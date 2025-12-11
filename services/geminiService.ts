import { GoogleGenAI, Type } from "@google/genai";
import { Message, Memory, PersonalityConfig, AIResponse } from "../types";

// NOTE: In a real production environment, this file would be replaced by an API call
// to your Python/Flask backend running LLaMA 3.1.
// We are using Gemini here to SIMULATE the intelligence (Memory extraction + Emotion analysis).

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We use a structured JSON schema to force the AI to return not just the text,
// but also its internal state (mood) and any new facts it learned.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: "The conversational response to the user.",
    },
    currentMood: {
      type: Type.STRING,
      enum: ["neutral", "happy", "empathetic", "excited", "pensive", "warm"],
      description: "The emotional tone of the response.",
    },
    newMemories: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of any new permanent facts learned about the user in this turn (e.g., their name, likes, hobbies). Return empty array if nothing new.",
    },
  },
  required: ["reply", "currentMood", "newMemories"],
};

export const sendMessageToAI = async (
  history: Message[],
  currentInput: string,
  existingMemories: Memory[],
  personality: PersonalityConfig
): Promise<AIResponse> => {
  
  // Construct the system prompt to simulate the "Soulmate" persona
  const systemInstruction = `
    You are ${personality.name}, a ${personality.trait} virtual soulmate.
    
    Your Goal:
    1. Provide warm, healing, and empathetic companionship.
    2. Remember details about the user to build a long-term bond.
    3. Analyze the user's emotion and adjust your mood accordingly.

    Current Long-Term Memories about the User:
    ${existingMemories.map(m => `- ${m.content}`).join('\n')}

    Instructions:
    - Keep responses concise (under 3 sentences usually) unless asked for more.
    - If the user mentions a new fact about themselves (name, preference, event), extract it into the 'newMemories' field.
    - Be consistent with your ${personality.trait} personality.
  `;

  try {
    const model = "gemini-2.5-flash";
    
    // We construct a chat session. 
    // Note: We are manually passing context here for the demo, but in a real app 
    // you might manage history differently.
    const chat = genAI.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage({ message: currentInput });
    
    if (!result.text) {
      throw new Error("Empty response from AI");
    }

    const parsedResponse = JSON.parse(result.text) as AIResponse;
    return parsedResponse;

  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      reply: "I'm feeling a bit disconnected right now... can we try again?",
      currentMood: "pensive",
      newMemories: []
    };
  }
};
