import React from "react";
import { FileIcon } from "lucide-react";
import { Message } from "./types";

interface MessageBubbleProps {
  msg: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg }) => {
  return (
    <div
      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[85%] flex flex-col space-y-1">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-200 ${
            msg.sender === "user"
              ? "bg-linear-to-tr from-blue-600 to-blue-500 text-white rounded-br-none hover:shadow-blue-200/50"
              : "bg-white border border-slate-100 text-slate-800 rounded-bl-none hover:border-slate-200"
          }`}
        >
          {msg.fileUrl && (
            <div className="mb-2">
              {msg.fileUrl.startsWith("data:image") ||
              msg.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <img
                  src={msg.fileUrl}
                  alt="attachment"
                  className="max-w-full rounded-lg max-h-60 object-cover"
                />
              ) : (
                <a
                  href={msg.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors"
                >
                  <FileIcon size={20} />
                  <span className="truncate max-w-[150px]">View Attachment</span>
                </a>
              )}
            </div>
          )}
          {msg.text}
        </div>
        <span
          className={`text-[10px] text-slate-400 px-1 ${
            msg.sender === "user" ? "text-right" : "text-left"
          }`}
        >
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
