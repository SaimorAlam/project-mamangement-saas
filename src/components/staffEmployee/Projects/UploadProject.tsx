import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, ChevronDown, Upload, Calendar } from "lucide-react";
import { FaRoad } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useGetAllTheLeafChartQuery } from "@/store/Api/ChartApi/ChartApi";
import PrimaryButton from "@/common/PrimaryButton";
import * as XLSX from "xlsx";
import { useCreateEmployeeSubmissionMutation } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadProject = () => {
  const [program, setProgram] = useState("");
  const [project, setProject] = useState("");
  const [information, setInformation] = useState("");
  const [ipAddress, setIpAddress] = useState<string>("::1");
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

  // Fetch device public IP on mount; fallback to "::1" if unavailable
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ip) setIpAddress(data.ip);
      })
      .catch(() => {
        // keep default "::1"
      });
  }, []);

  // API hooks
  const { data: programs } = useGetAllProgramQuery({});
  const { data: projects } = useGetAllProjectsQuery({});
  const { data: leafChartsData } = useGetAllTheLeafChartQuery(project, {
    skip: !project,
  });
  const [createEmployeeSubmission, { isLoading: isSubmitting }] =
    useCreateEmployeeSubmissionMutation();

  const dateOptions = [
    { value: "last1week", label: "Last 1 Week" },
    { value: "last1month", label: "Last 1 Month" },
    { value: "last3months", label: "Last 3 Months" },
    { value: "custom", label: "Custom Range" },
  ];

  const handleDateOptionChange = (value: string) => {
    setDateOption(value);

    if (value !== "custom") {
      setIsDatePickerOpen(false);

      const end = new Date();
      const start = new Date();

      if (value === "last1week") start.setDate(end.getDate() - 7);
      if (value === "last1month") start.setMonth(end.getMonth() - 1);
      if (value === "last3months") start.setMonth(end.getMonth() - 3);

      setCustomStartDate(start);
      setCustomEndDate(end);
    } else {
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
    const csvContent =
      "Day,On Time,Absent,Late\nSunday,,,\nMonday,,,\nTuesday,,,";

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
    setInformation("");
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    if (!project) {
      toast.error("Please select a project.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        if (workbook.SheetNames.length === 0) {
          toast.error("No sheets found in file.");
          return;
        }

        // Build elements array — one entry per sheet.
        // Sheet name format: "Some Label_CHARTID"
        // If no underscore, the whole sheet name is used as chartId.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const elements: any[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const lastUnderscoreIndex = sheetName.lastIndexOf("_");
          let chartId = sheetName;
          if (lastUnderscoreIndex !== -1) {
            chartId = sheetName.substring(lastUnderscoreIndex + 1).trim();
          }
          if (!chartId) chartId = sheetName;

          const xAxisStr = JSON.stringify(jsonData);
          const yAxisStr = JSON.stringify(jsonData);
          const zAxisStr = JSON.stringify(jsonData);

          elements.push({
            chartId,
            xAxis: xAxisStr,
            yAxis: yAxisStr,
            zAxis: zAxisStr,
          });
        });

        if (elements.length === 0) {
          toast.error("Could not build chart elements from file.");
          return;
        }

        const payload = {
          information: information || "Submission from staff employee panel",
          submission: projectNote || "Draft submission for manager review",
          projectId: project,
          ipAddress,
          elements,
        };

        try {
          await createEmployeeSubmission(payload).unwrap();
          toast.success("Submission uploaded successfully!");
          setFile(null);
          setProjectNote("");
          setAddNotes(false);
          setInformation("");
          navigate("/staff-employee-panel");
        } catch (apiError: unknown) {
          console.error("API Error:", apiError);
          const err = apiError as { data?: { message?: string }; status?: number };
          toast.error(
            err?.data?.message || "Failed to submit. Please try again."
          );
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Error processing file.");
    }
  };

  return (
    <div className="min-h-screen w-full my-6 bg-white text-black border border-gray-200 rounded-lg flex items-start justify-center px-4 pt-10">
      <div className="w-full max-w-xl">
        <h2 className="text-center text-lg font-semibold mb-6">
          Select Project &amp; Program Name First
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
              {programs?.data?.data?.map((p: { id: string; programName: string }) => (
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
              {projects?.data?.projects?.data.map((p: { id: string; name: string }) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-500" size={16} />
          </div>
        </div>

        {/* Submission Information */}
        <div className="mb-4">
          <label className="text-sm mb-1 block">Submission Information</label>
          <input
            type="text"
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            placeholder="e.g. Monthly performance report for Q1"
            className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-md text-sm"
          />
        </div>

        {/* Leaf Charts Info */}
        {project && leafChartsData?.data && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-xs text-blue-700 font-medium">
              {leafChartsData.data.length} chart(s) found for this project.
              Each sheet in your file should match a chart ID.
            </p>
          </div>
        )}

        {/* Date Range Selector */}
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
                  {dateOptions.find((opt) => opt.value === dateOption)?.label ||
                    "Select date range"}
                </span>
              </div>
              <ChevronDown
                className={`text-gray-500 transition-transform ${isDatePickerOpen ? "rotate-180" : ""
                  }`}
                size={16}
              />
            </div>

            {isDatePickerOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {dateOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleDateOptionChange(option.value)}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  >
                    {option.label}
                    {dateOption === option.value && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                ))}

                {dateOption === "custom" && (
                  <div className="p-4 border-t border-gray-200">
                    <DatePicker
                      selected={customStartDate}
                      onChange={(dates: [Date | null, Date | null]) => {
                        const [start, end] = dates;
                        setCustomStartDate(start);
                        setCustomEndDate(end);
                        if (end) {
                          setIsDatePickerOpen(false);
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

          {(customStartDate || customEndDate) && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {customStartDate?.toLocaleDateString()} -{" "}
              {customEndDate?.toLocaleDateString() || "Ongoing"}
            </p>
          )}
        </div>

        {/* Upload Section */}
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
              You haven't uploaded any data for this project. Start by
              importing a CSV or spreadsheet file.
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

              <PrimaryButton
                leftIcon={<Upload className="text-2xl" />}
                title={isSubmitting ? "Submitting..." : "Submit for Review"}
                type={"Primary"}
                onClick={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProject;