import React, { useState, useRef } from "react";
import { UploadCloud, ChevronDown, Upload } from "lucide-react";
import { FaRoad } from "react-icons/fa";

const ProjectFileUpload = () => {
  const [program, setProgram] = useState("");
  const [project, setProject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [addNotes, setAddNotes] = useState(false);
  const [projectNote, setProjectNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const programs = ["Program A", "Program B", "Program C"];
  const projects = ["Project X", "Project Y", "Project Z"];

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
  };

  const handleSaveDraft = () => {
    console.log({
      program,
      project,
      file: file?.name,
      notes: projectNote,
      addNotes,
    });
  };

  return (
    <div className="min-h-screen w-full my-6 bg-white text-black border border-gray-200 rounded-lg flex items-start justify-center px-4 pt-10">
      <div className="w-full max-w-xl">
        <h2 className="text-center text-lg font-semibold mb-6">
          Select Project & Program Name First
        </h2>

        <div className="mb-4">
          <label className="text-sm mb-1 block">Program Name *</label>
          <div className="relative">
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-md appearance-none"
            >
              <option value="">Select program name</option>
              {programs.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-500" size={16} />
          </div>
        </div>

        <div className="mb-8">
          <label className="text-sm mb-1 block">Project Name *</label>
          <div className="relative">
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-2 rounded-md appearance-none"
            >
              <option value="">Select Project Name</option>
              {projects.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-500" size={16} />
          </div>
        </div>


        {
        // Showing upload section only if project and program are selected
         program && project &&
        !file && (
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
              You haven't uploaded any data for this project. Start by importing
              a CSV or spreadsheet file to populate tasks or resources.
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
              Supported formats: .csv, .xls, .xlsx | Max file size: 10 MB
            </p>

            <div className="flex justify-center mb-4">
              <button
                onClick={handleImportClick}
                disabled={!program || !project}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-black px-6 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                Download Simple CSV Template →
              </button>
            </div>
          </>
        )
        
        }

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
              <button
                onClick={handleSaveDraft}
                className="px-5 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                Save Draft
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFileUpload;
