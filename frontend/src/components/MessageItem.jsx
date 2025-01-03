import React from "react";
import { MessageCircle, User } from "lucide-react";

const MessageItem = ({ message }) => {
  const renderMessage = (message) => {
    const parts = message.text.split("\n\n");
    return (
      <>
        {parts.map((part, index) => (
          <p key={index} className="text-sm whitespace-pre-wrap mb-2">
            {part}
          </p>
        ))}
      </>
    );
  };

  return (
    <div className={`flex ${message.user ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-end space-x-2 ${
          message.user ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.user ? "bg-purple-500" : "bg-gray-300"
          }`}
        >
          {message.user ? (
            <User size={16} className="text-white" />
          ) : (
            <MessageCircle size={16} className="text-gray-600" />
          )}
        </div>
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            message.user
              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {renderMessage(message)}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
