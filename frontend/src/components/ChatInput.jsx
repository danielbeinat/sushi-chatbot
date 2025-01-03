import React from "react";
import { Send } from "lucide-react";

const ChatInput = ({ input, setInput, sendMessage }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(input);
      }}
      className="p-4 bg-gray-50"
    >
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-2 rounded-full hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
