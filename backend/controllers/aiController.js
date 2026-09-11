const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ===============================
// Helper: Parse Gemini JSON
// ===============================
const parseSuggestions = (text) => {
    try {
        let cleaned = text.trim();

        cleaned = cleaned
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter(item => typeof item === "string")
            .map(item => item.trim())
            .filter(Boolean)
            .slice(0, 3);

    } catch (error) {
        console.error("Gemini JSON parsing error:", error);
        return [];
    }
};


// ===============================
// Predictive Typing
// ===============================
const predictiveTyping = async (req, res) => {
    try {
        const { text, recentMessages = [] } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }

        const prompt = `
You are an AI typing assistant for a group chat.

The user is currently typing:
"${text}"

Recent chat context:
${recentMessages.join("\n")}

Generate exactly 3 short and natural suggestions for what the user may type next.

Rules:
- Keep suggestions concise.
- Make them relevant to the current text.
- Use casual conversational language.
- Suggestions can contain phrases, not just one word.
- Do not explain anything.
- Return ONLY a valid JSON array of strings.

Example:
["5 pm", "tomorrow", "the office"]
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        const suggestions = parseSuggestions(response.text || "");

        return res.status(200).json({
            success: true,
            suggestions
        });

    } catch (error) {
        console.error("Predictive typing error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate typing suggestions"
        });
    }
};


// ===============================
// Smart Replies
// ===============================
const smartReplies = async (req, res) => {
    try {
        const { message, recentMessages = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const prompt = `
You are an AI assistant for a group chat.

Incoming message:
"${message}"

Recent conversation:
${recentMessages.join("\n")}

Generate exactly 3 short smart replies.

Rules:
- Replies must be relevant to the incoming message.
- Keep replies short and natural.
- Use casual conversational language.
- Replies may include emojis when appropriate.
- Avoid explanations.
- Return ONLY a valid JSON array of strings.

Example:
["Sure!", "Sounds good 👍", "Okay, I'll be there."]
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        const replies = parseSuggestions(response.text || "");

        return res.status(200).json({
            success: true,
            replies
        });

    } catch (error) {
        console.error("Smart replies error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate smart replies"
        });
    }
};


module.exports = {
    predictiveTyping,
    smartReplies
};