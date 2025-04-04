"use client";
import { useState, useRef, useEffect } from "react";



export default function Chat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      // if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const { response } = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl">DeepSeek Chat</h1>
      </header>

      <div className="flex-1 p-4 overflow-y-auto max-h-[70vh]">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${msg.role === "user" ? "bg-blue-200 ml-auto text-gray-900" : "bg-white mr-auto border border-gray-300"}`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-white p-4 rounded-lg mr-auto border border-gray-300 animate-pulse">
              <p>Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-300">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}