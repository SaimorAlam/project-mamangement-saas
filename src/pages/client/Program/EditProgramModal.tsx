import React, { useState, useEffect } from "react";
import { IProgram } from "@/types/client-panel";

interface EditProgramModalProps {
  open: boolean;
  program: IProgram;
  onClose: () => void;
  onSave: (updatedData: Partial<IProgram>) => void;
}

const EditProgramModal: React.FC<EditProgramModalProps> = ({
  open,
  program,
  onClose,
  onSave,
}) => {
  const [programName, setProgramName] = useState(program.programName);
  //   const [datetime, setDatetime] = useState(program.datetime || "");
  //   const [programDescription, setProgramDescription] = useState(
  //     program.programDescription || ""
  //   );
  //   const [priority, setPriority] = useState(program.priority || "MEDIUM");
  //   const [deadline, setDeadline] = useState(program.deadline || "");

  useEffect(() => {
    setProgramName(program.programName);
    // setDatetime(program.datetime || "");
    // setProgramDescription(program.programDescription || "");
    // setPriority(program.priority || "MEDIUM");
    // setDeadline(program.deadline || "");
  }, [program]);

  const handleSave = () => {
    onSave({
      programName,
      //   datetime,
      //   programDescription,
      //   priority,
      //   deadline,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Program</h2>

        <div className="flex flex-col gap-4">
          {/* Program Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Program Name
            </label>
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Date / Time
            </label>
            <input
              type="datetime-local"
              value={datetime ? new Date(datetime).toISOString().slice(0, 16) : ""}
              onChange={(e) => setDatetime(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none"
              rows={3}
            />
          </div>

  
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <PriorityDropdown
              defaultPriority={priority}
              onChange={(p: string) => setPriority(p)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={deadline ? new Date(deadline).toISOString().slice(0, 10) : ""}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div> */}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProgramModal;
