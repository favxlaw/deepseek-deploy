"use client";
import { useState, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const { response } = await res.json();

      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, an error occurred." }]);
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-ocean-lightest flex flex-col font-garamond">
      {/* Header */}
      <header className="bg-ocean-darker text-white p-4">
        <h1 className="text-2xl">DeepSeek Chat</h1>
      </header>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto max-h-[70vh]">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${
                msg.role === "user"
                  ? "bg-ocean-light ml-auto text-gray-900"
                  : "bg-ocean-lightest mr-auto border border-ocean-light"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-white p-4 rounded-lg mr-auto border border-ocean-light animate-pulse">
              <p>Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-ocean-light">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-ocean rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-ocean text-white rounded-lg hover:bg-ocean-dark transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
