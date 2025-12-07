import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Smile } from "lucide-react";

const DescriptionTextArea = ({
  handleAttachment,
  handleEmoji,
}: {
  handleAttachment: () => void;
  handleEmoji: () => void;
}) => {
  return (
    <div className="">
      <div className="relative">
        <Textarea
          id="description"
          placeholder="Write your message here"
          className="border border-[#CBD5E1] min-h-30 p-2"
        />
        <div className="flex absolute bottom-2 right-5 text-[#475569] gap-2">
          <Paperclip
            onClick={handleAttachment}
            className="size-4 cursor-pointer"
          />
          <Smile
            onClick={handleEmoji}
            className="size-4 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
export default DescriptionTextArea;
