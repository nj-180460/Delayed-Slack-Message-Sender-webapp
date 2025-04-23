import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
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