import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your plant assistant. Ask me anything about plants, gardening, or how to use PlantWise!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a plant assistant. Always answer in 1–2 sentences only. Do NOT use markdown symbols like *, #, -, **, or formatting. Give short, direct answers.\n\nUser: ${userMessage}`
                }
              ]
            }
          ]
        })
      });

      const resData = await response.json();
      let aiReply = resData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand.";

      // Remove markdown symbols including *
      aiReply = aiReply.replace(/[*#_\-`~>+\-=]/g, "").trim();

      setMessages(prev => [...prev, { role: "assistant", content: aiReply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process your request. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    const viewport = document.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-navbar text-navbar-foreground shadow-lg hover:scale-110 transition-all ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] bg-card border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="bg-navbar text-navbar-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Plant Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-navbar-foreground hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full w-full">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 items-end ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    
                    {/* Assistant Avatar */}
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-navbar text-navbar-foreground flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    {/* Chat Bubble */}
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-navbar text-navbar-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}>
                      {msg.content}
                    </div>

                    {/* User Avatar */}
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}

                  </div>
                ))}

                {/* Loader */}
                {isLoading && (
                  <div className="flex gap-2 items-center justify-start">
                    <div className="w-8 h-8 rounded-full bg-navbar text-navbar-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted p-3 rounded-2xl">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}

              </div>
            </ScrollArea>
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about plants..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-navbar hover:bg-plant-green-dark text-navbar-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Start New Chat Button */}
<div className="p-2 text-center border-t">

  <button
    onClick={() => setMessages([{ role: "assistant", content: "Hello! I'm your plant assistant. Ask me anything about plants!" }])}
    className="text-xs text-muted-foreground hover:text-primary underline"
  >
    Start new chat
  </button>
</div>

        </div>
      )}
    </>
  );
}
