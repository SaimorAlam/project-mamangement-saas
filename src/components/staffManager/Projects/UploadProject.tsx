import React, { useState, useRef } from "react";
import { UploadCloud, ChevronDown, Upload, Calendar } from "lucide-react";
import { FaRoad } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import PrimaryButton from "@/common/PrimaryButton";
import * as XLSX from "xlsx";
import { useUploadChartDataMutation } from "@/store/Api/ChartApi/ChartApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadProject = () => {
  const [program, setProgram] = useState("");
  const [project, setProject] = useState("");
  const [dateOption, setDateOption] = useState("last1week");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [addNotes, setAddNotes] = useState(false);
  const [projectNote, setProjectNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // API hooks
  const { data: programs } = useGetAllProgramQuery({});
  const { data: projects } = useGetAllProjectsQuery({});
  const [uploadChartData] = useUploadChartDataMutation();

  const dateOptions = [
    { value: "last1week", label: "Last 1 Week" },
    { value: "last1month", label: "Last 1 Month" },
    { value: "last3months", label: "Last 3 Months" },
    { value: "custom", label: "Custom Range" },
  ];

  const handleDateOptionChange = (value: string) => {
    setDateOption(value);

    if (value !== "custom") {
      // Auto-close the dropdown when preset is selected
      setIsDatePickerOpen(false);

      // Optionally auto-set dates based on selection
      const end = new Date();
      const start = new Date();

      if (value === "last1week") start.setDate(end.getDate() - 7);
      if (value === "last1month") start.setMonth(end.getMonth() - 1);
      if (value === "last3months") start.setMonth(end.getMonth() - 3);

      setCustomStartDate(start);
      setCustomEndDate(end);
    } else {
      // Open calendar for custom range
      setIsDatePickerOpen(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const downloadCsvTemplate = () => {
    const csvContent = "Day,On Time,Absent,Late\nSunday,,,\nMonday,,,\nTuesday,,,";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "project_data_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearData = () => {
    setFile(null);
    setProjectNote("");
    setAddNotes(false);
  };

  const handleSaveDraft = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    // Extract ID from filename: "Test 1_ID_A9QWX0_1EXPEW_1M2JBM_IZEEBR_FI4VF4.xlsx" -> "FI4VF4"
    // Remove extension first
    const fileNameWithoutExtension =
      file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    // Split by underscore
    const nameParts = fileNameWithoutExtension.split("_");
    // Take the last part as the ID
    let chartId = nameParts[nameParts.length - 1];

    chartId = chartId.trim();

    if (!chartId) {
      toast.error("Could not extract Chart ID from filename.");
      return;
    }

    console.log("Extracted Chart ID:", chartId);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Take the first sheet
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          toast.error("No sheets found in file.");
          return;
        }

        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const payload = {
          charts: [
            {
              id: chartId,
              xAxis: JSON.stringify({ labels: jsonData }),
              yAxis: JSON.stringify({ values: [] }), // Default empty as per client panel
              zAxis: JSON.stringify({ values: [] }), // Default empty as per client panel
            },
          ],
        };

        console.log("Payload:", payload);

        try {
          await uploadChartData(payload).unwrap();
          toast.success("File uploaded successfully!");
          // Optional: clear file after success
          // setFile(null);
        } catch (apiError: any) {
          console.error("API Error:", apiError);
          if (apiError.status === 404) {
            toast.error(`Chart with ID "${chartId}" not found in the database. Please verify the filename contains a valid and existing Chart ID.`);
          } else {
            toast.error(apiError?.data?.message || "Failed to upload chart data.");
          }
        }
      };

      reader.readAsBinaryString(file);
      setFile(null);
      setProjectNote("");
      setAddNotes(false);
      navigate("/staff-manager-panel");
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Error processing file.");
    }
  };

  return (
    <div className="min-h-screen w-full my-6 bg-white text-black border border-gray-200 rounded-lg flex items-start justify-center px-4 pt-10">
      <div className="w-full max-w-xl">
        <h2 className="text-center text-lg font-semibold mb-6">
          Select Project & Program Name First
        </h2>

        {/* Program Select */}
        <div className="mb-4">
          <label className="text-sm mb-1 block">Program Name *</label>
          <div className="relative">
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-md appearance-none"
            >
              <option value="">Select program name</option>
              {programs?.data?.data?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.programName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-500" size={16} />
          </div>
        </div>

        {/* Project Select */}
        <div className="mb-4">
          <label className="text-sm mb-1 block">Project Name *</label>
          <div className="relative">
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-md appearance-none"
            >
              <option value="">Select Project Name</option>
              {/* {projects.map((p: any) => (
                <option key={p} value={p}>{p}</option>
              ))} */}
              {projects?.data?.projects?.data.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-500" size={16} />
          </div>
        </div>

        {/* NEW: Date Range Selector */}
        <div className="mb-8">
          <label className="text-sm mb-1 block">Data Upload Date Range *</label>
          <div className="relative" ref={datePickerRef}>
            <div
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-md flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm">
                  {dateOptions.find((opt) => opt.value === dateOption)?.label || "Select date range"}
                </span>
              </div>
              <ChevronDown className={`text-gray-500 transition-transform ${isDatePickerOpen ? "rotate-180" : ""}`} size={16} />
            </div>

            {isDatePickerOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {/* Preset Options */}
                {dateOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleDateOptionChange(option.value)}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  >
                    {option.label}
                    {dateOption === option.value && <span className="text-blue-500">✓</span>}
                  </div>
                ))}

                {/* Custom Range Calendar */}
                {dateOption === "custom" && (
                  <div className="p-4 border-t border-gray-200">
                    <DatePicker
                      selected={customStartDate}
                      onChange={(dates: [Date | null, Date | null]) => {
                        const [start, end] = dates;
                        setCustomStartDate(start);
                        setCustomEndDate(end);
                        if (end) {
                          setIsDatePickerOpen(false); // Close when end date selected
                        }
                      }}
                      startDate={customStartDate}
                      endDate={customEndDate}
                      selectsRange
                      inline
                      calendarClassName="custom-datepicker"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Display selected range below */}
          {(customStartDate || customEndDate) && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {customStartDate?.toLocaleDateString()} - {customEndDate?.toLocaleDateString() || "Ongoing"}
            </p>
          )}
        </div>

        {/* Upload Section - Only show when program, project, and date range selected */}
        {program && project && dateOption && !file && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FaRoad size={32} className="text-gray-500" />
              </div>
            </div>

            <h3 className="text-center text-lg font-semibold mb-2">
              No file Added to this Project Yet
            </h3>

            <p className="text-center text-sm text-gray-400 mb-6">
              You haven't uploaded any data for this project. Start by importing a CSV or spreadsheet file.
            </p>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border border-dashed border-gray-500 rounded-lg p-10 text-center mb-4"
            >
              <Upload size={32} className="mx-auto text-gray-400 mb-4" />

              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your CSV/XLSX file here
              </p>
              <p className="text-sm text-gray-400 mb-2">or</p>

              <label className="text-blue-400 cursor-pointer">
                Browse your device →
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-xs text-gray-500 text-center mb-6">
              Supported formats: .xlsx | Max file size: 10 MB
            </p>

            <div className="flex justify-center mb-4">
              <button
                onClick={handleImportClick}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-black px-6 py-2 rounded-md text-sm"
              >
                <UploadCloud size={16} />
                Import Project File
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="text-center">
              <button
                onClick={downloadCsvTemplate}
                className="text-sm text-blue-400 hover:underline"
              >
                Download Sample CSV Template →
              </button>
            </div>
          </>
        )}

        {file && (
          <div className="bg-gray-900 border border-gray-700 rounded-md p-4 text-center mb-6">
            <p className="text-sm text-green-400 mb-2">
              File Selected Successfully
            </p>
            <p className="text-xs text-gray-300">{file.name}</p>
          </div>
        )}

        {file && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={addNotes}
                onChange={(e) => setAddNotes(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">
                Add Notes for Project Admin/Manager
              </span>
            </div>

            <textarea
              value={projectNote}
              onChange={(e) => setProjectNote(e.target.value)}
              disabled={!addNotes}
              placeholder="Write a short description..."
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm resize-none h-32 disabled:bg-gray-50 disabled:text-gray-400"
            />

            <div className="flex justify-between mt-6">
              <button
                onClick={handleClearData}
                className="px-5 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              {/* <button
                onClick={handleSaveDraft}
                className="px-5 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                Save Draft
              </button> */}

              {/* i want when i will click in this button then only the file will be uploaded with id in that router  */}
              <PrimaryButton
                leftIcon={<Upload className="text-2xl" />}
                title="Submit for Review"
                type={"Primary"}
                onClick={handleSaveDraft}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProject;