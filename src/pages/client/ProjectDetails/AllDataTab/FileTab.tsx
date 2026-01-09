import React, { useState, useMemo } from "react";
import {
  Download,
  Share2,
  FolderInput,
  Trash2,
  Search,
  ChevronDown,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Funnel,
} from "lucide-react";

interface FileItem {
  id: number;
  name: string;
  taskLink: string;
  addedBy: {
    name: string;
    avatar: string;
  };
  fileType: string;
  uploadDate: string;
  fileSize: string;
  icon: string;
}

const FileTab: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(
    new Set([1, 2, 3, 4])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  // Generate dummy data
  const allFiles: FileItem[] = useMemo(() => {
    const baseFiles = [
      {
        id: 1,
        name: "photo_2025-07-22_03-26-36.jpg",
        taskLink: "Planning",
        addedBy: { name: "Mike Smith", avatar: "MS" },
        fileType: "JPG Image",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "🖼️",
      },
      {
        id: 2,
        name: "blue_print_theta_analyzer.pdf",
        taskLink: "Plinth beam",
        addedBy: { name: "Jennifer Jones", avatar: "JJ" },
        fileType: "PDF",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "📄",
      },
      {
        id: 3,
        name: "LMI-PolicyComparisonReport - Home.xlsx",
        taskLink: "1st Floor Slab",
        addedBy: { name: "Sam Watson", avatar: "SW" },
        fileType: "Excel Worksheet",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "📊",
      },
      {
        id: 4,
        name: "Services Page.docx",
        taskLink: "2nd Floor Slab",
        addedBy: { name: "Sam Watson", avatar: "SW" },
        fileType: "Word Document",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "📝",
      },
      {
        id: 5,
        name: "Legion Ventures Overview v2 (2).pptx",
        taskLink: "3rd Floor Slab",
        addedBy: { name: "Jennifer Jones", avatar: "JJ" },
        fileType: "PowerPoint Presentation",
        uploadDate: "24-7-2024",
        fileSize: "70.47 MB",
        icon: "📊",
      },
      {
        id: 6,
        name: "GMT20250526-150157_Recording_1920×1080.mp4",
        taskLink: "Terrace Floor Slab",
        addedBy: { name: "Sam Watson", avatar: "SW" },
        fileType: "Mp4",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "🎥",
      },
      {
        id: 7,
        name: "PROJECT INFORMATION DASHBOARD 032525",
        taskLink: "Finishing Plan",
        addedBy: { name: "Mike Smith", avatar: "MS" },
        fileType: "PDF",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "📄",
      },
      {
        id: 8,
        name: "Legion Ventures Overview v2 (2).pptx",
        taskLink: "15-6-2024",
        addedBy: { name: "Sam Watson", avatar: "SW" },
        fileType: "PowerPoint Presentation",
        uploadDate: "24-7-2024",
        fileSize: "70.47 MB",
        icon: "📊",
      },
      {
        id: 9,
        name: "LMI-PolicyComparisonReport - Home.xlsx",
        taskLink: "1st Floor Slab",
        addedBy: { name: "Mike Smith", avatar: "MS" },
        fileType: "Excel Worksheet",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "📊",
      },
      {
        id: 10,
        name: "GMT20250526-150157_Recording_1920×1080.mp4",
        taskLink: "2nd Floor Slab",
        addedBy: { name: "Sam Watson", avatar: "SW" },
        fileType: "Mp4",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "🎥",
      },
      {
        id: 11,
        name: "Legion Ventures Overview v2 (2).pptx",
        taskLink: "1st Floor Slab",
        addedBy: { name: "Mike Smith", avatar: "MS" },
        fileType: "PowerPoint Presentation",
        uploadDate: "24-7-2024",
        fileSize: "70.47 MB",
        icon: "📊",
      },
      {
        id: 12,
        name: "Services Page.docx",
        taskLink: "2nd Floor Slab",
        addedBy: { name: "Sam Watson", avatar: "SW" },
        fileType: "Word Document",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "📝",
      },
      {
        id: 13,
        name: "Legion Ventures Overview v2 (2).pptx",
        taskLink: "3rd Floor Slab",
        addedBy: { name: "Mike Smith", avatar: "MS" },
        fileType: "PowerPoint Presentation",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "📊",
      },
      {
        id: 14,
        name: "blue_print_theta_analyzer.pdf",
        taskLink: "Terrace Floor Slab",
        addedBy: { name: "Sam Watson", avatar: "SW" },
        fileType: "PDF",
        uploadDate: "24-7-2024",
        fileSize: "70.47 KB",
        icon: "📄",
      },
    ];

    // Generate more dummy files
    const additionalFiles = [];
    for (let i = 15; i <= 500; i++) {
      const templates = baseFiles;
      const template = templates[i % templates.length];
      additionalFiles.push({
        ...template,
        id: i,
        name: `${template.name.split(".")[0]}_${i}.${
          template.name.split(".")[1]
        }`,
      });
    }

    return [...baseFiles, ...additionalFiles];
  }, []);

  // Filter files based on search
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return allFiles;
    return allFiles.filter(
      (file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.taskLink.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.addedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allFiles, searchQuery]);

  // Paginate files
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFiles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFiles, currentPage]);

  const toggleFileSelection = (id: number) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedFiles(newSelection);
  };

  const toggleAllFiles = () => {
    if (selectedFiles.size === paginatedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(paginatedFiles.map((f) => f.id)));
    }
  };

  const handleDownload = () => {
    alert(`Downloading ${selectedFiles.size} file(s)`);
  };

  const handleShare = () => {
    alert(`Sharing ${selectedFiles.size} file(s)`);
  };

  const handleMoveTo = () => {
    alert(`Moving ${selectedFiles.size} file(s)`);
  };

  const handleDelete = () => {
    if (
      confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)
    ) {
      alert("Files deleted");
      setSelectedFiles(new Set());
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push("...");
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen p-6">
      <div className=" mx-auto bg-white rounded-lg border border-gray-200">
        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
              {selectedFiles.size} Selected
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleMoveTo}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <FolderInput className="w-4 h-4" />
              Move to
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Project..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <Funnel className="w-4 h-4" />
              Filter By
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedFiles.size === paginatedFiles.length &&
                      paginatedFiles.length > 0
                    }
                    onChange={toggleAllFiles}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task link
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedFiles.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{file.icon}</span>
                      <span className="text-sm text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {file.taskLink}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                        {file.addedBy.avatar}
                      </div>
                      <span className="text-sm text-gray-900">
                        {file.addedBy.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {file.fileType}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {file.uploadDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {file.fileSize}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredFiles.length)} of{" "}
            <span className="font-medium text-blue-600">
              {filteredFiles.length}
            </span>{" "}
            Files
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : page === "..."
                    ? "text-gray-400 cursor-default"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTab;
