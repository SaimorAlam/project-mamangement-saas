interface CustomCheckBoxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CustomCheckbox=({ id, label, checked, onChange }: CustomCheckBoxProps)=> {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor={id}
        className="flex items-center relative h-6 w-11 cursor-pointer rounded-full transition-all duration-200"
      >
        {/* Hidden native checkbox for functionality and accessibility */}
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {/* The visual track for the custom switch */}
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200
            ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
        ></div>
        {/* The visual thumb for the custom switch */}
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-md transform transition-transform duration-200
            ${checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'}`}
        ></div>
      </label>
      <span className="text-sm font-medium leading-none text-gray-700">
        {label}
      </span>
    </div>
  );
}

export default CustomCheckbox