"use client";

import React from "react";

interface ChatMessagesProps {
  messages: any[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Chat</h3>
      {messages.length > 0 ? (
        <ul className="space-y-4">
          {messages.map((message, index) => (
            <li key={index} className="p-2 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-800">{message.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No chat history found.</p>
      )}
    </div>
  );
};

export default ChatMessages;