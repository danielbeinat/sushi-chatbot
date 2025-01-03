import React from "react";
import { X } from "lucide-react";

const ChatHeader = ({ setIsOpen }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 flex justify-between items-center">
      <h2 className="text-white font-bold">Sushi Chat Asistente</h2>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
