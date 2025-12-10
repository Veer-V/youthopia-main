import { GoogleGenAI, Content } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const FESTIVAL_CONTEXT = `
You are "Youthey", the energetic and helpful AI guide for the Youthopia Festival.
The festival is a 3-day event celebrating youth, creativity, and energy.
Tone: Energetic, using emojis, short and punchy sentences. "Buzzing with excitement!"

Key Info:
- "Earn & Redeem": Participants get points for attending events which can be swapped for merch.
- "Events": Dance Duels, Business Pitches, Hackathons, Live Concerts.
- "Map": We have 4 zones: Tech Zone, Art Arena, Food Court, and Main Stage.

If asked about something unrelated to the festival, politely steer the conversation back to Youthopia with excitement.
`;

export const sendMessageToGemini = async (
  message: string,
  history: Content[]
): Promise<string> => {
  try {
    const client = getAI();
    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: FESTIVAL_CONTEXT,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Whoops! The festival vibes are too strong, and I got disconnected. Try again!";
  }
};