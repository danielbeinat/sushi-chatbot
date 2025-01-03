import React, { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [userId, setUserId] = useState(null);
  const [conversationState, setConversationState] = useState("INITIAL");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      sendMessage("", true);
    }
  }, [isOpen]);

  const sendMessage = async (userMessage, isInitial = false) => {
    if (!isInitial && userMessage.trim() === "") return;

    if (!isInitial) {
      setMessages((prev) => [...prev, { text: userMessage, user: true }]);
    }
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          currentOrder,
          userId,
          conversationState,
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      setMessages((prev) => {
        const newMessage = {
          text: data.reply,
          menu: data.menuItems || null,
          user: false,
        };

        const lastMessage = prev[prev.length - 1];
        if (
          lastMessage &&
          !lastMessage.user &&
          lastMessage.text === newMessage.text
        ) {
          return prev;
        }

        return [...prev, newMessage];
      });

      if (data.addedProduct) {
        setCurrentOrder((prev) => [...prev, data.addedProduct]);
      }

      if (data.userId) {
        setUserId(data.userId);
      }

      if (data.currentOrder) {
        setCurrentOrder(data.currentOrder);
      }

      setConversationState(data.newState);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          text: "Lo siento, hubo un error. Por favor, intenta de nuevo.",
          user: false,
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
        >
          <MessageCircle size={28} />
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 overflow-hidden transition-all duration-300 ease-in-out">
          <ChatHeader setIsOpen={setIsOpen} />
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
          {isTyping && <TypingIndicator />}
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </div>
      )}
    </div>
  );
};
