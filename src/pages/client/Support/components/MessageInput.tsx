import React from "react";
import { Send, Paperclip, FileIcon, X } from "lucide-react";

interface MessageInputProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  filePreview: string | null;
  selectedFile: File | null;
  onRemoveFile: () => void;
  onFileClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputValue,
  onInputChange,
  onSendMessage,
  filePreview,
  selectedFile,
  onRemoveFile,
  onFileClick,
  fileInputRef,
  onFileChange,
}) => {
  return (
    <div className="p-4 bg-white border-t border-slate-100">
      {filePreview && (
        <div className="mb-3 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
          <div className="relative w-12 h-12 bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
            {filePreview === "file" ? (
              <FileIcon className="text-blue-500" />
            ) : (
              <img src={filePreview} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">
              {selectedFile?.name}
            </p>
            <p className="text-[10px] text-slate-400">
              {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={onRemoveFile}
            className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <form onSubmit={onSendMessage} className="relative group">
        <div className="absolute left-2 top-2 z-10">
          <button
            type="button"
            onClick={onFileClick}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            <Paperclip size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
          />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Type your message..."
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-14 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() && !selectedFile}
          className="absolute right-2 top-1.5 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 active:scale-95"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
