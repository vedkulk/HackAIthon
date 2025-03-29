import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LucideArrowLeft, LucideSend, LucideMusic } from "lucide-react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, I'm here to listen and support you. How are you feeling today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [askMood, setAskMood] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: messages.length + 1, text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      if (askMood) {
        const response = await axios.post("http://127.0.0.1:5001/chat", {
          message: input, // Instead of "play music", send actual mood input
          mood: input.toLowerCase(),
        });
        const botMessage = { id: messages.length + 2, text: response.data.response, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
        setAskMood(false);
        setShowPlaylist(true);
      } else {
        const response = await axios.post("http://127.0.0.1:5001/chat", { message: input });
        const botMessage = { id: messages.length + 2, text: response.data.response, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);

        if (response.data.ask_mood) {
          setAskMood(true);
          setMessages((prev) => [...prev, { id: messages.length + 3, text: response.data.response, sender: "bot" }]);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { id: messages.length + 2, text: "Sorry, there was an error. Please try again.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-indigo-700 hover:text-indigo-900 mb-8">
          <LucideArrowLeft className="mr-2" /> Back to Home
        </Link>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-rose-800 mb-8">Neura</h1>
          <div className="bg-white rounded-xl shadow-md border border-rose-100 overflow-hidden">
            <div className="h-[500px] overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.sender === "user" ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-800"}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-rose-100 text-rose-800 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="border-t border-rose-100 p-4">
              <div className="flex items-center">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border border-rose-200 rounded-lg p-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 resize-none"
                  placeholder={askMood ? "Enter your mood level (High/Medium/Low)" : "Type your message here..."}
                  rows={2}
                />
                <button onClick={handleSendMessage} disabled={!input.trim()} className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full disabled:opacity-50">
                  <LucideSend size={20} />
                </button>
              </div>
              <p className="text-xs text-rose-500 mt-2">
                Note: This is a simulated support chat. In a crisis, please call your local helpline.
              </p>
              <div className="mt-4 text-center">
                <Link to="/breathing-exercise" className="text-indigo-600 hover:underline">
                  Try a Breathing Exercise
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}