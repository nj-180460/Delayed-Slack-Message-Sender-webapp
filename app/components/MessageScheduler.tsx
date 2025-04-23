"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const SlackMessageScheduler: React.FC = () => {
  const [delay, setDelay] = useState<number | "">("");
  const [unit, setUnit] = useState<string>("seconds");
  const [message, setMessage] = useState<string>("");
  const [webhookURL, setWebhookURL] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    setIsButtonDisabled(!(delay && message && isValidWebhookURL(webhookURL)));
  }, [delay, message, webhookURL]);

  const isValidWebhookURL = (url: string): boolean => {
    return /^https:\/\/hooks\.slack\.com\/services\/.+/.test(url);
  };

  const calculateDelayInMs = (): number => {
    switch (unit) {
      case "minutes":
        return Number(delay) * 60 * 1000;
      case "hours":
        return Number(delay) * 60 * 60 * 1000;
      default:
        return Number(delay) * 1000;
    }
  };

  const handleSendMessage = () => {
    const delayInMs = calculateDelayInMs();

    setTimeout(() => {
      axios
        .post("/api/send-message", { webhookURL, message })
        .then(() => alert("✅ Message sent successfully!"))
        .catch((err) => alert(`❌ Failed to send message: ${err.message}`));
    }, delayInMs);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Slack Message Scheduler</h1>

      <div className="mb-4">
        <label className="block font-medium mb-2">Delay Amount:</label>
        <Input type="number" placeholder="Enter delay" value={delay} onChange={(e) => setDelay(Number(e.target.value))} />
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger>Choose Unit</SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">Seconds</SelectItem>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="hours">Hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Slack Message:</label>
        <Input type="text" placeholder="Enter your message" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Webhook URL:</label>
        <Input type="text" placeholder="Enter webhook URL" value={webhookURL} onChange={(e) => setWebhookURL(e.target.value)} />
      </div>

      <Button onClick={handleSendMessage} disabled={isButtonDisabled} className="w-full bg-blue-500 text-white hover:bg-blue-600">
        {delay ? `Send in ${delay} ${unit}` : "Send"}
      </Button>
    </div>
  );
};

export default SlackMessageScheduler;
