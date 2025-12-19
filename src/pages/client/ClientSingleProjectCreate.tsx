import { useState } from "react";
import FileUploadPage from "./FileUploadPage";
import SheetViewPage from "./SheetViewPage";
import { useNavigate } from "react-router-dom";
import { setFile } from "@/store/Slices/FileSlice/FileSlice";
import { useAppDispatch } from "@/hooks/useRedux";

function ClientSingleProjectCreate() {
  const [currentView, setCurrentView] = useState("upload"); // 'upload' or 'sheet'
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleFileUpload = (file: File) => {
    console.log("File received in ClientSingleProjectCreate:", file);
    dispatch(setFile(file));
    setCurrentView("sheet");
    navigate("/client-panel/single-project");
  };

  return (
    <div className="min-h-screen bg-white mx-auto overflow-x-scroll">
      {currentView === "upload" ? (
        <FileUploadPage onFileUpload={handleFileUpload} />
      ) : (
        <SheetViewPage />
      )}
    </div>
  );
}

export default ClientSingleProjectCreate;
