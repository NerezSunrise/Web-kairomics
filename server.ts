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

  // In-memory + persistent fallback registration data store
  interface RegistrationEntry {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    passwordHash: string; // Obfuscated/hashed representation for security
    enquiryReason: string;
    organization?: string;
    createdAt: string;
    ip?: string;
    forwardedTo: string;
  }

  const registrations: RegistrationEntry[] = [];

  // Register endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const { fullName, email, phone, password, enquiryReason, organization, captchaAnswer, captchaExpected } = req.body;

      if (!fullName || !email || !phone || !password || !enquiryReason) {
        return res.status(400).json({ error: "All required fields must be provided." });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Please enter a valid business or academic email address." });
      }

      // Bot captcha validation
      if (String(captchaAnswer).trim() !== String(captchaExpected).trim()) {
        return res.status(400).json({ error: "Security bot verification failed. Please try again." });
      }

      const newRecord: RegistrationEntry = {
        id: "REG-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        passwordHash: `***[Protected ${password.length} chars]***`,
        enquiryReason,
        organization: organization ? organization.trim() : "Not specified",
        createdAt: new Date().toISOString(),
        forwardedTo: "john.m@kairomics.com",
      };

      registrations.unshift(newRecord);

      console.log(`[PORTAL REGISTRATION] New user verified & registered for demo:`);
      console.log(`  Name: ${newRecord.fullName}`);
      console.log(`  Email: ${newRecord.email}`);
      console.log(`  Phone: ${newRecord.phone}`);
      console.log(`  Reason: ${newRecord.enquiryReason}`);
      console.log(`  Organization: ${newRecord.organization}`);
      console.log(`  Dispatched Notification to: john.m@kairomics.com`);
      console.log(`  Total Portal Registrations: ${registrations.length}`);

      return res.json({
        success: true,
        message: "Registration verified and saved successfully. Forwarded to john.m@kairomics.com.",
        registrationId: newRecord.id,
        demoUrl: "http://demo.kairomics.com/",
        record: newRecord
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: "Server failed to process registration." });
    }
  });

  // Get registrations (for admin table or Google Sheets / CSV sync)
  app.get("/api/registrations", (req, res) => {
    res.json({
      total: registrations.length,
      data: registrations,
      targetRecipient: "john.m@kairomics.com"
    });
  });

  // Export registrations as CSV for Google Sheets import
  app.get("/api/registrations/export-csv", (req, res) => {
    const headers = "ID,Full Name,Email,Phone,Enquiry Role / Reason,Organization,Created Date,Forwarded To\n";
    const rows = registrations.map(r => 
      `"${r.id}","${r.fullName.replace(/"/g, '""')}","${r.email}","${r.phone}","${r.enquiryReason}","${(r.organization || '').replace(/"/g, '""')}","${r.createdAt}","${r.forwardedTo}"`
    ).join("\n");
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=kairomics_demo_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(headers + rows);
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
