import React, { useState } from 'react';
import { X, Mail, Calendar, HelpCircle, Copy } from 'lucide-react';

interface Tag {
  id: number;
  label: string;
}

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeRole, setEmployeeRole] = useState('Viewer - Default');
  const [joinedDate, setJoinedDate] = useState('Today');
  const [description, setDescription] = useState('');
  const [loginEmail, setLoginEmail] = useState('milus_smith@acme.com');
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [notifyProjectManager, setNotifyProjectManager] = useState(false);

  const [skillTags, setSkillTags] = useState<Tag[]>([
    { id: 1, label: 'Civil Eng' },
    { id: 2, label: 'Architect' }
  ]);

  const [projectTags, setProjectTags] = useState<Tag[]>([
    { id: 1, label: 'Carlyle Hall' },
    { id: 2, label: 'Highway expedition' }
  ]);

  const removeSkillTag = (id: number) => {
    setSkillTags(skillTags.filter(tag => tag.id !== id));
  };

  const removeProjectTag = (id: number) => {
    setProjectTags(projectTags.filter(tag => tag.id !== id));
  };

  const addSkillTag = () => {
    const newTag = prompt('Enter skill name:');
    if (newTag) {
      setSkillTags([...skillTags, { id: Date.now(), label: newTag }]);
    }
  };

  const addProjectTag = () => {
    const newTag = prompt('Enter project name:');
    if (newTag) {
      setProjectTags([...projectTags, { id: Date.now(), label: newTag }]);
    }
  };

  const handleSubmit = () => {
    console.log('Employee added:', {
      employeeName,
      employeeEmail,
      employeeRole,
      joinedDate,
      description,
      skillTags,
      projectTags,
      loginEmail,
      sendWelcomeEmail,
      notifyProjectManager
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add New Employee</h2>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Employee details</h3>

          <div className="space-y-5">
            {/* Employee Name and Email Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Enter employee name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Employee Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={employeeEmail}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    placeholder="Enter employee email"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none "
                  />
                </div>
              </div>
            </div>

            {/* Employee Role and Skill Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Employee Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={employeeRole}
                  onChange={(e) => setEmployeeRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none  bg-white appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
                >
                  <option>Viewer - Default</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Editor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Skill</label>
                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[38px]">
                  {skillTags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {tag.label}
                      <button
                        onClick={() => removeSkillTag(tag.id)}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={addSkillTag}
                    className="inline-flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 text-xs cursor-pointer"
                  >
                    Add more
                  </button>
                </div>
              </div>
            </div>

            {/* Joined Date and Project Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Joined Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={joinedDate}
                    onChange={(e) => setJoinedDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none  pr-16"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <HelpCircle size={16} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Calendar size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Project</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[38px]">
                    {projectTags.map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {tag.label}
                        <button
                          onClick={() => removeProjectTag(tag.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={addProjectTag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-800 text-xs"
                    >
                      Add more
                    </button>
                  </div>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 9L1 4h10z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Program Description and Login Email Preview Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1.5">
                  Program Description
                  <HelpCircle size={14} className="text-gray-400" />
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a description..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none  resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Login Email Preview
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none  pr-8"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-p">
                    <Copy size={16} />
                  </button>
                </div>
                
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sendWelcomeEmail}
                      onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">Send Welcome Email With Login Link</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifyProjectManager}
                      onChange={(e) => setNotifyProjectManager(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">Notify Project Manager</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;