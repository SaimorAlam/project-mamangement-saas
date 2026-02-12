import { useState } from "react";

import SheetViewPage from "./SheetViewPage";
import { useNavigate } from "react-router-dom";
import { setFile } from "@/store/Slices/FileSlice/FileSlice";
import { useAppDispatch } from "@/hooks/useRedux";
import FileUpload from "@/components/client/Settings/FileUploadComponent";

function ClientSingleProjectCreate() {
  const [currentView, setCurrentView] = useState("upload"); // 'upload' or 'sheet'
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleFileUpload = (file: File) => {
    dispatch(setFile(file));
    setCurrentView("sheet");
    navigate("/client-panel/single-project");
  };

  return (
    <div className="min-h-screen bg-white mx-auto overflow-x-scroll">
      {currentView === "upload" ? (
        <FileUpload
          label="Upload Project File"
          description="Upload your project file here"
          requirements="File format: .xlsx, .xls, .csv"
          buttonText="Upload"
          onFileUpload={handleFileUpload}
        />
      ) : (
        <SheetViewPage />
      )}
    </div>
  );
}

export default ClientSingleProjectCreate;
