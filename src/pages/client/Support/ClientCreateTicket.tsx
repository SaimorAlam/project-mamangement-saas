import { useState } from "react";
import { Plus, Send, X, Paperclip } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateSupportMutation } from "@/store/Api/AdminApi/ClientSupportApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ClientCreateTicket = () => {
  const [createSupport] = useCreateSupportMutation();

  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachment(file);
  };

  const removeFile = () => {
    setAttachment(null);
  };

  const handleSubmit = async () => {
    if (!issueType || !message.trim()) {
      toast.error("Please select an issue type and write a message");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("issueType", issueType);
      formData.append("message", message);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await createSupport(formData).unwrap();

      toast.success("Support ticket created successfully");

      setIssueType("");
      setMessage("");
      setAttachment(null);
    } catch {
      toast.error("Something went wrong while creating the ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-4 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          Create Ticket
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-white">
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">
            Create Support Ticket
          </h4>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Issue Type
            </label>
            <div>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger className="w-full mt-2 h-10 text-sm border-gray-300 focus:ring-1 focus:ring-black">
                  <SelectValue placeholder="Select an issue" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="LOGINFAILED">Login Failed</SelectItem>
                  <SelectItem value="SYSTEMERROR">System Error</SelectItem>
                  <SelectItem value="OTHERPROBLEM">Other Problem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full mt-2 border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-black"
              />
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer text-gray-600 hover:text-black absolute bottom-4 right-2">
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Attachment */}
            <div className="space-y-2">
              {attachment && (
                <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm">
                  <span className="truncate max-w-[260px]">
                    {attachment.name}
                  </span>
                  <X
                    className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-600"
                    onClick={removeFile}
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
            >
              Send
              <Send className="w-4 h-4" />
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreateTicket;
