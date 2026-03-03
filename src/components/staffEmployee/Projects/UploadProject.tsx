/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useMemo } from "react";
import { UploadCloud, ChevronDown, Upload } from "lucide-react";
import { FaRoad } from "react-icons/fa";
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useGetAllTheLeafChartQuery } from "@/store/Api/ChartApi/ChartApi";
import { useUploadChartDataMutation } from "@/store/Api/ChartApi/ChartApi";
import PrimaryButton from "@/common/PrimaryButton";
import * as XLSX from "xlsx";
import { useCreateEmployeeSubmissionMutation } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import DateRangePicker from "@/components/client/DateRange";

const UploadProject = () => {
  // ── URL search params (set when navigating from project details) ──────────
  const [searchParams] = useSearchParams();
  const presetProgramId = searchParams.get("programId") ?? "";
  const presetProjectId = searchParams.get("projectId") ?? "";

  // ── form state ────────────────────────────────────────────────────────────
  const [program, setProgram] = useState(presetProgramId);
  const [project, setProject] = useState(presetProjectId);
  const [information, setInformation] = useState("");
  const [ipAddress, setIpAddress] = useState<string>("::1");
  const [file, setFile] = useState<File | null>(null);
  const [addNotes, setAddNotes] = useState(false);
  const [projectNote, setProjectNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Sync URL params → state if params change
  useEffect(() => {
    if (presetProgramId) setProgram(presetProgramId);
    if (presetProjectId) setProject(presetProjectId);
  }, [presetProgramId, presetProjectId]);

  // Fetch device public IP; fallback to "::1"
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ip) setIpAddress(data.ip);
      })
      .catch(() => { });
  }, []);

  // ── API hooks ─────────────────────────────────────────────────────────────
  const { data: programs } = useGetAllProgramQuery({});
  const { data: projects } = useGetAllProjectsQuery({});
  const { data: leafChartsData } = useGetAllTheLeafChartQuery(project, {
    skip: !project,
  });
  const [createEmployeeSubmission, { isLoading: isSubmitting }] =
    useCreateEmployeeSubmissionMutation();
  // Same mutation the CLIENT PANEL uses to actually write chart values to the DB
  const [uploadChartData, { isLoading: isUploading }] =
    useUploadChartDataMutation();

  // ── Derived: all projects & filter by program ─────────────────────────────
  const allProjects: any[] =
    projects?.data?.projects?.data || projects?.data?.data || [];

  const filteredProjects = useMemo(() => {
    if (!program) return allProjects;
    return allProjects.filter(
      (p: any) => p.programId === program || p.program?.id === program
    );
  }, [program, allProjects]);

  // ── Flat list of all leaf charts for full-ID matching ─────────────────────
  const allLeafCharts: any[] = useMemo(
    () => (leafChartsData?.data || []).flatMap((g: any) => g.charts || []),
    [leafChartsData]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleClearData = () => {
    setFile(null);
    setProjectNote("");
    setAddNotes(false);
    setInformation("");
  };

  // ── Program change: reset project if it no longer belongs ────────────────
  const handleProgramChange = (newProgramId: string) => {
    setProgram(newProgramId);
    const currentProjectBelongs = allProjects.some(
      (p: any) =>
        p.id === project &&
        (p.programId === newProgramId || p.program?.id === newProgramId)
    );
    if (!currentProjectBelongs) setProject("");
  };

  // ── Helper: resolve full chart UUID from an 8-char sheet-name suffix ──────
  const resolveChartId = (idSuffix: string): string => {
    if (!idSuffix) return idSuffix;
    const matched = allLeafCharts.find(
      (c: any) =>
        c.id === idSuffix ||
        c.id?.slice(-8) === idSuffix
    );
    return matched?.id ?? idSuffix;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
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

        const chartsPayload: any[] = [];
        const elements: any[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const lastUnderscoreIndex = sheetName.lastIndexOf("_");
          let idSuffix = sheetName;
          if (lastUnderscoreIndex !== -1) {
            idSuffix = sheetName.substring(lastUnderscoreIndex + 1).trim();
          }
          if (!idSuffix) idSuffix = sheetName;

          const fullChartId = resolveChartId(idSuffix);
          const xAxisStr = JSON.stringify({ labels: jsonData });
          const yAxisStr = JSON.stringify({ values: [] });
          const zAxisStr = JSON.stringify({ values: [] });

          chartsPayload.push({ id: fullChartId, xAxis: xAxisStr, yAxis: yAxisStr, zAxis: zAxisStr });
          elements.push({ chartId: fullChartId, xAxis: xAxisStr, yAxis: yAxisStr, zAxis: zAxisStr });
        });

        if (chartsPayload.length === 0) {
          toast.error("Could not build chart elements from file.");
          return;
        }

        try {
          // ── Step 1: Write chart values to the DB (same call as client panel) ──
          const toastId = toast.loading("Uploading chart data…");
          await uploadChartData({ charts: chartsPayload }).unwrap();
          toast.success(
            `${chartsPayload.length} chart(s) updated successfully!`,
            { id: toastId }
          );

          // ── Step 2: Create submission record for manager review ──────────────
          const submissionPayload = {
            information: information || "Submission from staff employee panel",
            submission: projectNote || "Draft submission for manager review",
            projectId: project,
            ipAddress,
            elements,
          };
          await createEmployeeSubmission(submissionPayload).unwrap();
          toast.success("Submission sent to manager for review!");

          // Reset form
          setFile(null);
          setProjectNote("");
          setAddNotes(false);
          setInformation("");

          // Navigate back to the project details page
          navigate(`/staff-employee-panel/projects/project-details/${project}`);
        } catch (apiError: unknown) {
          console.error("API Error:", apiError);
          const err = apiError as {
            data?: { message?: string };
            status?: number;
          };
          toast.error(err?.data?.message || "Failed to submit. Please try again.");
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Error processing file.");
    }
  };

  const isProcessing = isSubmitting || isUploading;
  const preselected = !!(presetProgramId && presetProjectId);

  return (
    <div className="min-h-screen w-full my-6 bg-white text-black border border-gray-200 rounded-lg flex items-start justify-center px-4 pt-10">
      <div className="w-full max-w-xl">
        <h2 className="text-center text-lg font-semibold mb-2">
          Upload Project Submission
        </h2>

        {preselected ? (
          <p className="text-center text-xs text-blue-600 mb-6">
            Program and project are pre-selected from the project details page.
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500 mb-6">
            Select a Program &amp; Project first, then upload your filled Excel template.
          </p>
        )}

        {/* Program Select */}
        <div className="mb-4">
          <label className="text-sm mb-1 block">Program Name *</label>
          <div className="relative">
            <select
              value={program}
              onChange={(e) => handleProgramChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-md appearance-none"
            >
              <option value="">Select program name</option>
              {programs?.data?.data?.map(
                (p: { id: string; programName: string }) => (
                  <option key={p.id} value={p.id}>
                    {p.programName}
                  </option>
                )
              )}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-500" size={16} />
          </div>
        </div>

        {/* Project Select – filtered by selected program */}
        <div className="mb-4">
          <label className="text-sm mb-1 block">Project Name *</label>
          <div className="relative">
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-md appearance-none"
              disabled={!program}
            >
              <option value="">
                {program ? "Select Project Name" : "Select a program first"}
              </option>
              {filteredProjects.map((p: { id: string; name: string }) => (
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
              {allLeafCharts.length} chart(s) found for this project. Upload the
              Excel file downloaded from the project details page — each sheet
              corresponds to one chart and will update its values directly.
            </p>
          </div>
        )}

        {/* Date Range Selector – shared DateRangePicker */}
        <div className="mb-8">
          <label className="text-sm mb-2 block">Data Upload Date Range *</label>
          <DateRangePicker />
        </div>

        {/* Upload drop zone */}
        {program && project && !file && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FaRoad size={32} className="text-gray-500" />
              </div>
            </div>
            <h3 className="text-center text-lg font-semibold mb-2">
              No File Added Yet
            </h3>
            <p className="text-center text-sm text-gray-400 mb-6">
              Upload the Excel file you downloaded from the project details page.
              Each sheet corresponds to one chart and its values will be updated immediately.
            </p>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border border-dashed border-gray-500 rounded-lg p-10 text-center mb-4"
            >
              <Upload size={32} className="mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your XLSX file here
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
          </>
        )}

        {/* Selected file confirmation */}
        {file && (
          <div className="bg-gray-900 border border-gray-700 rounded-md p-4 text-center mb-6">
            <p className="text-sm text-green-400 mb-2">File Selected Successfully</p>
            <p className="text-xs text-gray-300">{file.name}</p>
            {allLeafCharts.length > 0 && (
              <p className="text-xs text-blue-400 mt-1">
                {allLeafCharts.length} chart(s) will be updated when you submit.
              </p>
            )}
          </div>
        )}

        {/* Notes + Submit */}
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
              placeholder="Write a short description…"
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
                title={isProcessing ? "Processing…" : "Submit for Review"}
                type={"Primary"}
                onClick={handleSubmit}
                disabled={isProcessing}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProject;