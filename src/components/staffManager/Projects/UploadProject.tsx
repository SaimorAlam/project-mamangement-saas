import React, { useState } from "react";
import {
  Calendar,
  Upload,
  Info,
  CloudUpload,
  MapPin,
} from "lucide-react";
import Papa from "papaparse";
import { FaRoad } from "react-icons/fa";
import DataTable from "./DataTable";
import { useNavigate } from "react-router-dom";
import { useHeaderContext } from "@/Layout/staffManagerPanel/StaffManagerHeaderContext";

const UploadProject = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 1 Week");
  const [showDropdown, setShowDropdown] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [projectNote, setProjectNote] = useState("");
  const [addNotes, setAddNotes] = useState(true);
  const navigate = useNavigate();
  const { setHeading, setBreadcrumb, setShowButton } =
    useHeaderContext();

  const periods = [
    "Last 1 Week",
    "Last 2 Weeks",
    "Last 1 Month",
    "Last 3 Months",
    "Last 6 Months",
    "Last 1 Year",
  ];

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          if (results.data.length > 0) {
            setHeaders(Object.keys(results.data[0]));
            setTableData(results.data);
          }
        },
        error: (error: any) => {
          console.error("Error parsing CSV:", error);
          alert(
            "Error parsing file. Please ensure it's a valid CSV file."
          );
        },
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          if (results.data.length > 0) {
            setHeaders(Object.keys(results.data[0]));
            setTableData(results.data);
          }
        },
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClearData = () => {
    setTableData([]);
    setHeaders([]);
  };

  const handleSaveDraft = () => {
    setHeading("Carlyle Hall Project");
    setBreadcrumb(
      <div className="flex items-center">
        <MapPin className="w-4 h-4 mr-1" />
        25 Union Square W, New York, NY 10003, USA
      </div>
    );
    setShowButton(true);
    navigate("/carlyle-hall", {
      state: { uploadedData: tableData, uploadedHeaders: headers },
    });
  };

  return (
    <div className="min-h-screen py-6 w-full">
      <div className="border border-gray-200 rounded-lg">
        {/* Date Selection */}
        <div className="bg-white rounded-lg  p-6 pt-6">
          <h2 className="text-center text-lg font-semibold text-gray-800 mb-4 mt-6">
            Select Data Upload Date First
          </h2>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 min-w-[150px] justify-between cursor-pointer"
              >
                <Calendar size={16} />
                <span>{selectedPeriod}</span>
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {periods.map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setSelectedPeriod(period);
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-700"
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          {tableData.length === 0 ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaRoad size={32} className="text-gray-500" />
                </div>
              </div>

              <h3 className="text-center text-base font-semibold text-gray-800 mb-2">
                No file Added to this Project Yet
              </h3>

              <p className="text-center text-sm text-gray-500 mb-8">
                You haven't uploaded any data for this project. Start
                by importing
                <br />a CSV or spreadsheet file to populate tasks or
                resources.
              </p>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex justify-center mb-4">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop your CSV/XLSX file here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="inline-block">
                  <span className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm font-medium">
                    Browse your device →
                  </span>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-4">
                  Supported formats: .csv, .xls, .xlsx, .mqd | Max
                  file size: 10 MB
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <button className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer">
                  <CloudUpload size={16} />
                  Import Project File
                </button>
              </div>

              <div className="text-center mb-6">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-500"
                >
                  Download Simple CSV Template →
                </a>
              </div>
            </>
          ) : null}
        </div>

        {/* Data Table */}
        {tableData.length > 0 && (
          <div className="overflow-x-auto max-w-6xl mx-auto">
            <DataTable headers={headers} tableData={tableData} />
          </div>
        )}

        <div className="p-6">
          {/* Notes Section */}
          <div className="flex items-center gap-3 mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={addNotes}
                onChange={(e) => setAddNotes(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm text-gray-700">
              Add Notes for Project Admin/Manager
            </span>
          </div>

          {/* Project Note */}
          <div>
            <label className="flex items-center gap-1 text-sm text-gray-700 mb-2">
              Project Note
              <Info size={14} className="text-gray-400" />
            </label>
            <textarea
              value={projectNote}
              onChange={(e) => setProjectNote(e.target.value)}
              placeholder="Write a short description..."
              disabled={!addNotes}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none h-32 ${
                !addNotes
                  ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>

          {/* ✅ Buttons Section */}
          {tableData.length > 0 && (
            <div className="flex justify-between mt-6">
              {/* Cancel Button */}
              <button
                onClick={handleClearData}
                className="px-5 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {/* Save Draft Button */}
              <button
                onClick={handleSaveDraft}
                className="px-5 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadProject;
