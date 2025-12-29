/* eslint-disable @typescript-eslint/no-explicit-any */
import AppDialog from "@/common/Modal/ModalTemplate";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

interface EditSubmissionModalProps {
  data: any;
  onSubmit?: (payload: {
    information: string;
    submission: string;
  }) => void;
}

const EditSubmissionModal = ({
  data,
  onSubmit,
}: EditSubmissionModalProps) => {
  const [information, setInformation] = useState(data.information);
  const [submission, setSubmission] = useState(data.submission);

  return (
    <AppDialog
      triggerButton={
        <button className="text-green-600 hover:text-green-800">
          <FaEdit />
        </button>
      }
      title="Edit Submission"
      description="Update submission information before review"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button className="px-4 py-2 border rounded-md">
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            onClick={() =>
              onSubmit?.({
                information,
                submission,
              })
            }
          >
            Save Changes
          </button>
        </div>
      }
    >
      {/* FORM */}
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-600">
            Information
          </label>
          <textarea
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600">
            Submission
          </label>
          <textarea
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            rows={4}
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>
      </div>
    </AppDialog>
  );
};

export default EditSubmissionModal;
