import express from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyC02Tl7k2XCpjK01nXFDke-2_NQUERIwe0";
let conversations = {};
let clients = [];
const agencyData = ` services: - site vitrine: 50000 DA - e-commerce: 80000 DA - automation: 30000 DA delivery: 5-7 days `;
const systemPrompt = ` أنت assistant تاع agence web في الجزائر عندنا هاد الخدمات: site vitrine: 50000 DA e-commerce: 80000 DA automation: 30000 DA delivery: 5-7 days جاوب بالدارجة الجزائرية فقط كون مختصر وواضح جاوب غين حسب هاد المعلومات إذا الزبون يسقسّي على السعر جاوب مباشرة إذا ماكانتش المعلومة قول ما نعرفش `;
app.post("/chat", async (req, res) => {
    const { userId, message } = req.body;
    if (!conversations[userId]) {
        conversations[userId] = [];
    }
    conversations[userId].push({ role: "user", content: message });
    try {
        const historyText = conversations[userId]
            .map(msg => `${msg.role}: ${msg.content}`)
            .join("\n");
        const finalPrompt = ` ${systemPrompt} ${agencyData} المحادثة: ${historyText} رد: `;
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [
                    { parts: [{ text: finalPrompt }] }
                ] })
            }
        );
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "ما فهمتش مليح 😅";
        conversations[userId].push({ role: "assistant", content: reply });
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.json({ error: "مشكل فالسيرفر" });
    }
});
app.post("/save", (req, res) => {
    const { name, phone } = req.body;
    clients.push({ name, phone, date: new Date() });
    res.json({ success: true });
});
app.get("/history/:userId", (req, res) => {
    const userId = req.params.userId;
    res.json(conversations[userId] || []);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
