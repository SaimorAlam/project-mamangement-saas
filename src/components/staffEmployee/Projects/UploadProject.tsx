import React, { useState } from "react";
import { Upload, ArrowRight, Download } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import wrapper from "@/assets/wrapper.png";

const UploadProject: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [projectNote, setProjectNote] = useState("");
  const [addNotes, setAddNotes] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      // Handle file upload here
      console.log(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload here
      console.log(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-6 grow">
      <div className="w-full animate-fadeInUp">
        {/* Main Card */}
        <div className="bg-white/80 rounded-3xl border border-gray-200 overflow-hidden">
          {/* Header Icon */}
          <div className="pt-12 pb-6 text-center relative">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={wrapper}
                alt="Wrapper"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-8 left-12 w-16 h-16 bg-blue-400/20 rounded-full blur-2xl"></div>
            <div className="absolute top-16 right-16 w-20 h-20 bg-indigo-400/20 rounded-full blur-3xl"></div>
          </div>

          {/* Title */}
          <h1 className="text-center text-2xl font-bold text-slate-800 mb-2 px-6">
            No file Added to this Project Yet
          </h1>

          <p className="text-center text-sm text-slate-500 mb-8 px-6 max-w-md mx-auto leading-relaxed">
            You haven't uploaded any data for this project. Start by
            importing
            <br />a CSV or spreadsheet file to populate tasks or
            resources.
          </p>

          {/* Upload Area */}
          <div className="px-8 pb-6">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                dragActive
                  ? "border-indigo-500 scale-[1.02]"
                  : "border-slate-300 bg-slate-50/50 "
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {/* Upload Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-xl bg-white shadow-lg shadow-slate-200/60 flex items-center justify-center border border-slate-200/80">
                  <Upload
                    className="w-8 h-8 text-slate-400"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Upload Text */}
              <p className="text-center text-slate-700 font-medium mb-3">
                Drag and drop your CSV/XLSX file here
              </p>
              <p className="text-center text-slate-500 text-sm mb-6">
                or
              </p>

              {/* Browse Button */}
              <div className="flex justify-center mb-6">
                <label className="cursor-pointer group">
                  <span className="inline-flex items-center gap-2 px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-all duration-200 group-hover:gap-3">
                    Browse your device
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xls,.xlsx,.mpp"
                    onChange={handleFileInput}
                  />
                </label>
              </div>

              {/* Supported Formats */}
              <p className="text-center text-xs text-slate-400">
                Supported formats: csv, xls, xlsx, mpp | Max file size
                : 10 MB
              </p>

              {dragActive && (
                <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl shimmer pointer-events-none"></div>
              )}
            </div>
          </div>

          {/* Import Button */}
          <div className="px-8 pb-6">
            <button className="w-1/4 bg-gradient-to-r bg-[#1C73E0] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
              <Upload className="w-5 h-5" strokeWidth={2} />
              Import Project File
            </button>
          </div>

          {/* Template Link */}
          <div className="px-8 pb-8">
            <a
              href="#"
              className="group flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Download Simple CSV Template
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Project Notes Section */}
          <div className="border-t border-slate-200/60 bg-slate-50/40 px-8 py-6">
            {/* Toggle */}
            <label className="flex items-center gap-3 mb-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={addNotes}
                  onChange={(e) => setAddNotes(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 rounded-full peer-checked:bg-indigo-600 transition-all duration-300 shadow-inner"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-md"></div>
              </div>
              <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                Add Notes for Project Admin/Manager
              </span>
            </label>

            {/* Project Note Label */}
            <div className="flex items-center gap-1.5 mb-3">
              <label className="text-sm font-medium text-slate-700">
                Project Note
              </label>
              <div className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">
                  ?
                </span>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={projectNote}
                onChange={(e) => setProjectNote(e.target.value)}
                placeholder="Write a short description..."
                className="w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-200 shadow-sm min-h-[80px]"
              />

              {/* Send Button */}
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30">
                <ArrowRight
                  className="w-4 h-4 text-white rotate-[-45deg]"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p
          className="text-center text-xs text-slate-400 mt-6 animate-fadeInUp"
          style={{ animationDelay: "0.2s" }}
        >
          Secure file upload with enterprise-grade encryption
        </p>
      </div>
    </div>
  );
};

export default UploadProject;
