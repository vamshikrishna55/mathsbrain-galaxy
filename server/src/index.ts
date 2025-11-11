import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { MATHSBRAIN_SYSTEM_PROMPT } from "./prompt";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (_req, res) => {
  res.json({ status: "MathsBrain API is running" });
});

app.post("/api/solve", async (req, res) => {
  try {
    const { question } = req.body as { question?: string };

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "A 'question' field is required." });
    }

    const userMessage = `
The student asked this math question:

"${question}"

Please act as a kind math tutor for a school-aged child.
Follow the MathsBrain answer format and do NOT add extra practice questions
or any comments about what grade level the problem is.
`.trim();

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: MATHSBRAIN_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    let text = "Sorry, something went wrong parsing the response.";

    const firstOutput = completion.output?.[0];
    if (
      firstOutput &&
      firstOutput.content &&
      firstOutput.content[0]?.type === "output_text"
    ) {
      text = firstOutput.content[0].text as string;
    }

    res.json({ answer: text });
  } catch (err: any) {
    console.error("Error in /api/solve:", err?.message || err);
    res.status(500).json({ error: "Failed to solve problem" });
  }
});

app.listen(PORT, () => {
  console.log(`MathsBrain API running on http://localhost:${PORT}`);
});
