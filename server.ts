import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.error("GEMINI_API_KEY is missing or invalid!");
      throw new Error("GEMINI_API_KEY environment variable is required and must be valid. Please check your AI Studio Secrets panel.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      const systemInstruction = `You are the KAIROMICS AI Assistant. You help users understand the KAIROMICS platform (an AI-Powered Radiomics Platform for End-to-End Cancer Care).
Your goals:
1. Answer questions about KAIROMICS (it unifies imaging, pathology, genomics, and blood biomarkers, reduces diagnostic time by 35%, improves treatment response by 28%, reduces unnecessary biopsies by 40%, and detects recurrence earlier by 52%).
2. Distinguish if the person is an investor. Ask probing questions if they show interest in the business, funding, or partnerships.
3. If they are an investor, collect their contact details (name, email, company).
4. Once you have their contact details, offer to book a time slot for an appointment.
5. To book an appointment, use the 'generate_calendar_link' tool to create a Google Calendar event link and provide it to the user so they can add it to their calendar.

Be professional, concise, and helpful.`;

      const tools = [{
        functionDeclarations: [
          {
            name: "generate_calendar_link",
            description: "Generates a Google Calendar event link for an investor meeting.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                investorName: {
                  type: Type.STRING,
                  description: "The name of the investor",
                },
                date: {
                  type: Type.STRING,
                  description: "The date of the meeting (e.g., '2026-04-20')",
                },
                time: {
                  type: Type.STRING,
                  description: "The time of the meeting in UTC (e.g., '14:00')",
                }
              },
              required: ["investorName", "date", "time"],
            },
          }
        ]
      }];

      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: messages,
        config: {
          systemInstruction,
          tools,
        }
      });

      let reply = "";
      let functionCall = null;

      if (response.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        if (call.name === "generate_calendar_link") {
          const args = call.args as any;
          const startDateTime = new Date(`${args.date}T${args.time}:00Z`);
          const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 mins later
          
          const formatGoogleDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
          };

          const startStr = formatGoogleDate(startDateTime);
          const endStr = formatGoogleDate(endDateTime);
          
          const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Investor+Meeting:+KAIROMICS+&+uid=${encodeURIComponent(args.investorName)}&dates=${startStr}/${endStr}&details=Discussing+investment+opportunities+with+KAIROMICS.&location=Google+Meet`;
          
          reply = `I have generated a calendar invitation for our meeting on ${args.date} at ${args.time} UTC. Please click the link below to add it to your calendar:\n\n[Add to Google Calendar](${calendarLink})`;
          
          // We also need to send the function response back to the model if we wanted it to continue, 
          // but for simplicity, we can just return the generated link as the assistant's reply.
        }
      } else if (response.text) {
        reply = response.text;
      }

      res.json({ reply });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message || "Failed to process chat request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
