/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  HelpCircle,
  Plus,
  Send,
  ArrowRight,
  Waypoints,
} from "lucide-react";
import { useUploadChartDataMutation } from "@/store/Api/ChartApi/ChartApi";
import { useAppSelector } from "@/hooks/useRedux";
import ProjectUploadSuccessModal from "./ProjectUploadSuccessModal";
import { useNavigate } from "react-router-dom";

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
  projectId?: string;
  isModal?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  projectId: propProjectId,
  isModal = false,
}) => {
  const [uploadChartData] = useUploadChartDataMutation();
  const reduxProjectId = useAppSelector((state) => state.chartSlice.projectId);
  const projectId = propProjectId || reduxProjectId;
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [projectNote, setProjectNote] = useState("");
  const [addNotesChecked, setAddNotesChecked] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const [sheetCount, setSheetCount] = useState(0);

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        const chartsPayload: any[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Parse sheet name for ID
          const lastUnderscoreIndex = sheetName.lastIndexOf("_");
          let id = sheetName;

          if (lastUnderscoreIndex !== -1) {
            id = sheetName.substring(lastUnderscoreIndex + 1);
          }

          if (!id.trim()) {
            id = sheetName;
          }

          // PROCESS DATA STRUCTURE: Ensure we always have [HeaderRow, DataRow, ...]
          const rawRows = jsonData.filter(
            (row) =>
              Array.isArray(row) &&
              row.length > 0 &&
              String(row[0] || "").trim() !== "",
          );

          if (rawRows.length === 0) return;

          // 1. Detect if the first row is a header (all strings)
          const isHeader = rawRows[0].every((cell: any) => {
            if (cell === null || cell === undefined || String(cell).trim() === "")
              return true;
            return typeof cell === "string" && isNaN(Number(cell));
          });

          let finalXAxisData: any[][];

          if (isHeader) {
            // Keep existing header but normalize first cell
            const normalizedHeader = [...rawRows[0]];
            normalizedHeader[0] = "Label";
            finalXAxisData = [normalizedHeader, ...rawRows.slice(1)];
          } else {
            // No header detected - synthesize one to maintain structure
            const colCount = Math.max(...rawRows.map((r) => r.length));
            const syntheticHeader = ["Label"];
            for (let i = 1; i < colCount; i++) {
              syntheticHeader.push(`Legend ${i}`);
            }
            finalXAxisData = [syntheticHeader, ...rawRows];
          }

          chartsPayload.push({
            id: id,
            xAxis: JSON.stringify(finalXAxisData),
            yAxis: JSON.stringify({ values: [] }),
            zAxis: JSON.stringify({ values: [] }),
          });
        });

        if (chartsPayload.length === 0) {
          alert("No valid sheets found in the file.");
          return;
        }

        const payload = {
          charts: chartsPayload,
        };

        // Call API
        await uploadChartData(payload).unwrap();

        setSheetCount(chartsPayload.length);
        setUploadStatus("success");
        setShowSuccessModal(true);

        if (onFileUpload) {
          onFileUpload(file);
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadStatus("error");
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleOpenProject = () => {
    navigate(`/client-panel/project-builder/project-details/${projectId}`);
  };

  return (
    <>
      <div
        className={`flex gap-6 font-sans text-[#111827] ${
          isModal ? "h-full" : "min-h-[80vh]"
        }`}
      >
        {/* Main Upload Area */}
        <div
          className={`flex-1 p-12 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm ${
            isModal ? "border-none shadow-none p-4" : ""
          }`}
        >
          <div className="w-full max-w-[600px] flex flex-col items-center">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-6">
                {/* Road/Map icon placeholder */}
                <Waypoints className="w-10 h-10 text-slate-500" />
              </div>
              <h1 className="text-2xl font-semibold text-[#111827] mb-3">
                No file Added to this Project Yet
              </h1>
              <p className="text-[#6B7280] text-sm leading-relaxed max-w-md mx-auto">
                You haven't uploaded any data for this project. Start by
                importing a CSV or spreadsheet file to populate tasks or
                resources.
              </p>
            </div>

            {!file ? (
              <>
                {/* Drag & Drop Zone */}
                <div
                  className={`w-full border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 mb-4 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-[#E5E7EB] bg-white hover:border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Upload className="w-6 h-6 text-[#374151]" />
                  </div>
                  <p className="text-[#374151] font-medium text-sm">
                    Drag and drop your CSV/XLSX file here
                  </p>
                </div>

                {/* Supported Formats */}
                <p className="text-[#9CA3AF] text-xs text-center mb-6">
                  Supported formats: .csv, .xls, .xlsx, .mpp | Max file size :
                  10 MB
                </p>

                {/* OR Divider */}
                <div className="text-[#111827] font-medium text-sm mb-6">
                  OR
                </div>

                {/* Browse Button */}
                <button
                  onClick={handleBrowse}
                  className="bg-[#1D64D8] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mb-10"
                >
                  Browse your device
                  <ArrowRight className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xls,.xlsx,.ods"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </>
            ) : (
              <div className="w-full mb-10">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
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
                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {uploadStatus === "success" && (
                  <div className="mt-3 flex items-center gap-2 text-green-600 text-sm justify-center">
                    <CheckCircle className="w-4 h-4" />
                    <span>File uploaded successfully</span>
                  </div>
                )}
              </div>
            )}

            {/* Footer Section - Notes */}
            <div className="w-full self-start">
              {/* Toggle Header */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setAddNotesChecked(!addNotesChecked)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    addNotesChecked ? "bg-[#1D64D8]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`${
                      addNotesChecked ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
                <span className="text-sm font-medium text-[#374151]">
                  Add Notes for Project Admin/Manager
                </span>

                {/* Persistent Open Project Button (Only visible after success) */}
                {uploadStatus === "success" && (
                  <button
                    onClick={handleOpenProject}
                    className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    Open Project <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Note Input */}
              {addNotesChecked && (
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-xs text-[#374151] font-medium mb-2">
                    Project Note
                    <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  </label>
                  <div className="relative">
                    <textarea
                      value={projectNote}
                      onChange={(e) => setProjectNote(e.target.value)}
                      placeholder="Write a short description..."
                      className="w-full h-32 px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!file}
                  className="bg-[#1D64D8] hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4 fill-current" /> Submit Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Preserved */}
        <div className={`w-96 h-fit overflow-y-auto ${
          isModal ? "hidden" : "hidden xl:block"
        }`}>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-full">
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
                <span className="text-sm text-gray-500 font-medium">
                  0 Tags
                </span>
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

      <ProjectUploadSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        projectId={projectId}
        sheetCount={sheetCount}
      />
    </>
  );
};

export default FileUpload;
