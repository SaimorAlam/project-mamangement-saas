import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Plus,
  Send,
} from "lucide-react";
import { useUploadChartDataMutation } from "@/store/Api/ChartApi/ChartApi";

const FileUpload = () => {
    const [uploadChartData] = useUploadChartDataMutation()
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [projectNote, setProjectNote] = useState("");
  const [addNotesChecked, setAddNotesChecked] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validExtensions = [".csv", ".xls", ".xlsx", ".ods"];
    const fileExtension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      if (selectedFile.size <= 10 * 1024 * 1024) {
        setFile(selectedFile);
        setUploadStatus(null);
      } else {
        setUploadStatus("error");
        alert("File size exceeds 10MB limit");
      }
    } else {
      setUploadStatus("error");
      alert("Please upload a valid file format: CSV, XLS, XLSX, or ODS");
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //   const handleSubmit = () => {
  //     if (file && onFileUpload) {
  //       setUploadStatus("success");
  //       setTimeout(() => {
  //         onFileUpload(file);
  //       }, 500);
  //     }
  //   };

  return (
    <div className="flex gap-6 min-h-[80vh]">
      {/* Main Upload Area */}
      <div className="flex-1 p-8 md:p-12 flex flex-col overflow-y-auto bg-white rounded-xl border-gray-200 border">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="size-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <img
                src="/upload.png"
                alt="File Upload"
                className="size-8"
                
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              No file Added to this Project Yet
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              You haven't uploaded any data for this project. Start by importing
              a CSV or spreadsheet file to populate tasks or resources.
            </p>
          </div>

          {/* Drag & Drop Zone */}
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Upload className="w-5 h-5 text-gray-700" />
              </div>
              <p className="text-gray-900 font-medium mb-1">
                Drag and drop your CSV/XLSX file here
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Supported formats: .csv, .xls, .xlsx, .mpp | Max file size : 10
                MB
              </p>

              <div className="flex items-center gap-3 w-1/2 mx-auto mb-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button
                onClick={handleBrowse}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 mx-auto"
              >
                Browse your device
                <span>→</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xls,.xlsx,.ods"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {file.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {uploadStatus === "success" && (
                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>File uploaded successfully</span>
                </div>
              )}
            </div>
          )}

          {/* Notes Section */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-9 h-5 rounded-full p-1 cursor-pointer transition-colors relative ${
                  addNotesChecked ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => setAddNotesChecked(!addNotesChecked)}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${
                    addNotesChecked ? "translate-x-4" : ""
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Add Notes for Project Admin/Manager
              </span>
            </div>

            {addNotesChecked && (
              <div className="relative">
                <label className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                  Project Note <AlertCircle className="w-3 h-3" />
                </label>
                <div className="relative">
                  <textarea
                    value={projectNote}
                    onChange={(e) => setProjectNote(e.target.value)}
                    placeholder="Write a short description..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                  <button
                    // onClick={handleSubmit}
                    disabled={!file}
                    className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 hidden xl:block overflow-y-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* Program Manager */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Program Manager
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Alex Thompson"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  Alex Thompson
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  alex.thompson@example.com
                </p>
              </div>
            </div>
          </div>

          {/* Program Duration */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Program Duration
            </h3>
            <div className="bg-[#F8F9FA] rounded-xl p-5">
              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-medium">
                    Start Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    21-Oct-2024
                  </p>
                </div>
                <div className="">
                  <p className="text-xs text-gray-500 mb-1 font-medium">
                    End Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    21-Oct-2024
                  </p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500 font-medium">
                    Time Remaining
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#3B82F6] h-1.5 rounded-full"
                      style={{ width: "35%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    45 days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500 font-medium">0 Tags</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Tags
              </button>
            </div>
          </div>

          {/* Issues */}
          <div>
            <div className="bg-[#F8F9FA] rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-gray-500">
                No Issues reported yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
