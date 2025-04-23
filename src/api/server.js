import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// ✅ Allow specific origin (replace with your frontend URL)
// ✅ Allow requests from localhost:5173 AND your deployed frontend domain
const allowedOrigins = ["http://localhost:5173", "https://delayed-slack-message-sender-webapp.vercel.app", "https://delayed-slack-message-sender-webapp-pcuuiqgte.vercel.app"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));



app.use(express.json());
app.use(cors());

app.post("/send-message", async (req, res) => {
  const { webhookURL, message } = req.body;

  if (!webhookURL || !message) {
    return res.status(400).json({ error: "Webhook URL and message are required!" });
  }

  try {
    await axios.post(webhookURL, { text: `From Neil's Slack Bot: ${message}` });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;