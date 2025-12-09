import PrimaryButton from "../common/PrimaryButton";
import { Upload } from "lucide-react";

interface FileUploadProps {
  label: string;
  description: string;
  requirements: string;
  buttonText: string;
  className?: string;
}

const FileUpload = ({
  label,
  description,
  requirements,
  buttonText,
  className = "",
}: FileUploadProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <p className="text-xs text-gray-500 mb-3">{description}</p>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center grid items-center justify-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-xs text-gray-600 mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500 mb-3">{requirements}</p>
        <PrimaryButton
          type="Primary"
          title={buttonText}
          className="text-xs px-4! py-2!"
        />
      </div>
    </div>
  );
};

export default FileUpload;
