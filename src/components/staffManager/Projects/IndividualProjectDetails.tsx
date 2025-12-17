import AppDialog from "@/common/Modal/ModalTemplate";
import { Upload, FileText, X, Eye } from "lucide-react";
import { useState } from "react";

const IndividualProjectDetails = ({project}:any) => {
    const [selectedFile, setSelectedFile] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "text/csv") {
            setSelectedFile(file);
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    return (
        <div className="p-6">
            <AppDialog
                triggerButton={
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
                        <Eye size={16} />
                    </button>
                }
                title="Upload Submission"
                description="Click the below area to upload your CSV file."
                footer={
                    <div className="w-full flex gap-3">
                        
                    </div>
                }
            >
                {/* Main Modal Content */}
                <div className="mt-4">
                    {project}
                    <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">

                        {!selectedFile ? (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-indigo-500" />
                                <p className="mb-2 text-sm text-gray-700">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">CSV files only (max. 10MB)</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-white border rounded-md shadow-sm">
                                <FileText className="text-indigo-600" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                        {selectedFile.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedFile(null);
                                    }}
                                    className="ml-2 p-1 hover:bg-red-100 rounded-full text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            </AppDialog>
        </div>
    );
};

export default IndividualProjectDetails;