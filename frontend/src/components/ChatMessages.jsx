import React from "react";
import MessageItem from "./MessageItem";

const ChatMessages = ({ messages, messagesEndRef }) => {
  return (
    <div className="h-96 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
