// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState } from "react";
import {
  Upload,
  Calendar,
  Tag,
  AlertCircle,
  X,
  FileText,
  CheckCircle,
} from "lucide-react";

export default function FileUploadPage({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [projectNote, setProjectNote] = useState("");
  const [addNotesChecked, setAddNotesChecked] = useState(true);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      const validExtensions = [".csv", ".xls", ".xlsx", ".ods"];
      const fileExtension = droppedFile.name
        .substring(droppedFile.name.lastIndexOf("."))
        .toLowerCase();

      if (validExtensions.includes(fileExtension)) {
        if (droppedFile.size <= 10 * 1024 * 1024) {
          // 10MB limit
          setFile(droppedFile);
          setUploadStatus(null);
        } else {
          setUploadStatus("error");
          alert("File size exceeds 10MB limit");
        }
      } else {
        setUploadStatus("error");
        alert(
          "Please upload a valid file format: CSV, XLS, XLSX, or ODS"
        );
      }
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const validExtensions = [".csv", ".xls", ".xlsx", ".ods"];
      const fileExtension = selectedFile.name
        .substring(selectedFile.name.lastIndexOf("."))
        .toLowerCase();

      if (validExtensions.includes(fileExtension)) {
        if (selectedFile.size <= 10 * 1024 * 1024) {
          // 10MB limit
          setFile(selectedFile);
          setUploadStatus(null);
        } else {
          setUploadStatus("error");
          alert("File size exceeds 10MB limit");
        }
      } else {
        setUploadStatus("error");
        alert(
          "Please upload a valid file format: CSV, XLS, XLSX, or ODS"
        );
      }
    }
  };

  const handleBrowse = () => {
    document.getElementById("fileInput").click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus(null);
    // Reset file input
    document.getElementById("fileInput").value = "";
  };

  const handleSubmit = () => {
    if (file) {

      // Navigate to sheet view page
      if (onFileUpload) {
        // Small delay to show success state
        setTimeout(() => {
          onFileUpload(file);
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  A
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              No file Added to this Project Yet
            </h1>
            <p className="text-gray-500 text-sm">
              You haven't uploaded any data for this project. Start by
              importing a CSV or spreadsheet file to populate tasks or
              resources.
            </p>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-700 font-medium mb-1">
                  Drag and drop your CSV/XLSX file here
                </p>
                <p className="text-gray-400 text-sm">
                  Supported formats: .csv, .xls, .xlsx, .ods | Max
                  file size: 10 MB
                </p>
              </div>
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              <button
                onClick={handleBrowse}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Browse your device
                <Upload className="w-4 h-4" />
              </button>
              <input
                id="fileInput"
                type="file"
                accept=".csv,.xls,.xlsx,.ods"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          {/* File Selected Display */}
          {file && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-blue-900 text-sm font-medium">
                      {file.name}
                    </p>
                    <p className="text-blue-600 text-xs mt-0.5">
                      {(file.size / 1024).toFixed(2)} KB • Ready to
                      upload
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === "success" && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 text-sm font-medium">
                File uploaded successfully!
              </p>
            </div>
          )}

          {/* Add Notes Checkbox */}
          <div className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="addNotes"
              checked={addNotesChecked}
              onChange={(e) => setAddNotesChecked(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="addNotes"
              className="text-sm text-gray-700 font-medium"
            >
              Add Notes for Project Admin/Manager
            </label>
          </div>

          {/* Project Note Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Project Note
              <AlertCircle className="w-4 h-4 text-gray-400" />
            </label>
            <div className="relative">
              <textarea
                value={projectNote}
                onChange={(e) => setProjectNote(e.target.value)}
                placeholder="Write a short description..."
                className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                disabled={!addNotesChecked}
              />
              <button
                onClick={handleSubmit}
                disabled={!file}
                className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors"
                title={
                  file
                    ? "Submit and view data"
                    : "Please select a file first"
                }
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
            {file && (
              <p className="mt-2 text-xs text-gray-500">
                Click the arrow button to proceed to the sheet view →
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        {/* Program Manager */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Program Manager
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">
                AT
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Alex Thompson
              </p>
              <p className="text-xs text-gray-500">
                alex.thompson@example.com
              </p>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Project Overview
          </h3>
          <div className="space-y-4">
            {/* Dates */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Start Date
                </p>
                <p className="text-sm font-medium text-gray-800">
                  21-Oct-2024
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="text-sm font-medium text-gray-800">
                  21-Oct-2024
                </p>
              </div>
            </div>

            {/* Time Remaining */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500">
                  Time Remaining
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  45 days
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              0 Tags
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              + Add Tags
            </button>
          </div>
        </div>

        {/* Issues */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Issues
          </h3>
          <p className="text-sm text-gray-600">
            No issues reported yet
          </p>
        </div>
      </div>
    </div>
  );
}
