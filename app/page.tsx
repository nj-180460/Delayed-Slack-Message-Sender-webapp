"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Home() {
  const [delayAmount, setDelayAmount] = useState("");
  const [delayUnit, setDelayUnit] = useState("seconds");
  const [message, setMessage] = useState("");
  const [webhookURL, setWebhookURL] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("");

  const isValidWebhookURL = (url: string) => {
    const slackWebhookRegex = /^https:\/\/hooks\.slack\.com\/services\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/;
    return slackWebhookRegex.test(url);
  };  

  const handleSendMessage = async () => {
    if (!delayAmount || !message || !webhookURL) return;

    if (!isValidWebhookURL(webhookURL)) {
      setDialogMessage("Invalid Slack webhook URL!");
      setDialogType("error");
      setDialogOpen(true);
      return;
    }  
  
    const delayMilliseconds =
      delayUnit === "seconds"
        ? Number(delayAmount) * 1000
        : delayUnit === "minutes"
        ? Number(delayAmount) * 60000
        : Number(delayAmount) * 3600000;
  
    setIsSending(true);
  
    setTimeout(async () => {
      try {
        await axios.post("/api/send-message", {
          webhookURL,
          message,
        });
  
        setIsSending(false);
        setDialogMessage("Message sent successfully!");
        setDialogType("success");
        setDialogOpen(true);
      } catch (error) {
        console.error("Error sending message:", error);
        setIsSending(false);
        setDialogMessage("Failed to send message. Please check your webhook URL.");
        setDialogType("error");
        setDialogOpen(true);
      }
    }, delayMilliseconds);
  };
  

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
      <label className="font-semibold">Delay Amount:</label>
      <Input
        type="number"
        placeholder="Enter delay"
        value={delayAmount}
        onChange={(e) => setDelayAmount(e.target.value)}
      />

      <label className="font-semibold">Select Time Unit:</label>
      <Select value={delayUnit} onValueChange={setDelayUnit}>
        <SelectTrigger>{delayUnit}</SelectTrigger>
        <SelectContent>
          <SelectItem value="seconds">Seconds</SelectItem>
          <SelectItem value="minutes">Minutes</SelectItem>
          <SelectItem value="hours">Hours</SelectItem>
        </SelectContent>
      </Select>

      <label className="font-semibold">Slack Message:</label>
      <Input
        type="text"
        placeholder="Enter Slack message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <label className="font-semibold">Slack Webhook URL:</label>
      <Input
        type="text"
        placeholder="Enter Slack webhook URL"
        value={webhookURL}
        onChange={(e) => setWebhookURL(e.target.value)}
      />

      <Button 
        disabled={!delayAmount || !message || !webhookURL}
        onClick={handleSendMessage}
        className="bg-green-700 hover:bg-green-800 text-white"
      >
        {isSending ? "Sending..." : `Send in ${delayAmount} ${delayUnit}`}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogType === "success" ? "Success!" : "Error"}</DialogTitle>
          </DialogHeader>
            <p>{dialogMessage}</p>
          <Button 
            onClick={() => setDialogOpen(false)}
            className={dialogType === "success" ? "bg-green-700 hover:bg-green-800 text-white" : "bg-red-700 hover:bg-red-800 text-white" }
            >
              OK
          </Button>
        </DialogContent>
      </Dialog>

    </div>
  );
}
