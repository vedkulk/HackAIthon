import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LucideArrowLeft, LucideSend, LucideMusic } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, I'm here to listen and support you. How are you feeling today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Show playlist recommendation occasionally
      if (Math.random() > 0.7) {
        setShowPlaylist(true);
      }
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const userInputLower = userInput.toLowerCase();

    // Simple response logic - in a real app, this would use an AI model
    if (userInputLower.includes("sad") || userInputLower.includes("depress") || userInputLower.includes("down")) {
      return "I'm sorry to hear you're feeling this way. Remember that it's okay to not be okay sometimes. Would you like to talk more about what's troubling you?";
    } else if (
      userInputLower.includes("anxious") ||
      userInputLower.includes("worry") ||
      userInputLower.includes("stress")
    ) {
      return "Anxiety can be really challenging. Try taking a few deep breaths with me. Inhale for 4 counts, hold for 4, and exhale for 6. Would you like to explore some grounding techniques together?";
    } else if (
      userInputLower.includes("happy") ||
      userInputLower.includes("good") ||
      userInputLower.includes("great")
    ) {
      return "I'm glad to hear you're feeling positive! What's contributing to these good feelings today?";
    } else if (
      userInputLower.includes("music") ||
      userInputLower.includes("song") ||
      userInputLower.includes("playlist")
    ) {
      setShowPlaylist(true);
      return "Music can be very therapeutic. I've prepared a playlist that might help soothe your mind. Would you like to explore other types of music?";
    } else if (
      userInputLower.includes("help") ||
      userInputLower.includes("suicide") ||
      userInputLower.includes("die")
    ) {
      return "I'm concerned about what you're sharing. Please remember that help is available. Consider reaching out to a crisis helpline at 988 (US) or a trusted person in your life. Would you like me to provide more resources?";
    } else {
      return "Thank you for sharing. How does talking about this make you feel? I'm here to listen without judgment.";
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
          <h1 className="text-3xl font-bold text-rose-800 mb-8">Support Chat</h1>

          <div className="bg-white rounded-xl shadow-md border border-rose-100 overflow-hidden">
            <div className="h-[500px] overflow-y-auto p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user" ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-rose-100 text-rose-800 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {showPlaylist && (
                  <div className="flex justify-start">
                    <div className="bg-rose-100 text-rose-800 rounded-2xl px-4 py-3 w-full max-w-[80%]">
                      <div className="flex items-center mb-2">
                        <LucideMusic className="mr-2 text-rose-600" />
                        <span className="font-medium">Recommended Playlist</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 space-y-2">
                        <PlaylistItem title="Calming Piano Melodies" artist="Various Artists" />
                        <PlaylistItem title="Nature Sounds for Relaxation" artist="Ambient Sounds" />
                        <PlaylistItem title="Positive Affirmations" artist="Mindfulness" />
                        <PlaylistItem title="Gentle Acoustic Guitar" artist="Instrumental" />
                        <PlaylistItem title="Uplifting Classical" artist="Orchestra" />
                      </div>
                      <button
                        className="mt-2 text-rose-600 text-sm hover:text-rose-800"
                        onClick={() => setShowPlaylist(false)}
                      >
                        Hide playlist
                      </button>
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
                  placeholder="Type your message here..."
                  rows={2}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full disabled:opacity-50"
                >
                  <LucideSend size={20} />
                </button>
              </div>
              <p className="text-xs text-rose-500 mt-2">
                Note: This is a simulated support chat. In a crisis, please call 988 (US) or your local emergency
                services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaylistItem({ title, artist }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-rose-800">{title}</div>
        <div className="text-sm text-rose-600">{artist}</div>
      </div>
      <button className="text-rose-500 hover:text-rose-700">
        <LucideMusic size={16} />
      </button>
    </div>
  );
}