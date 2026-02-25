import { ReactNode } from "react";

export interface ButtonProps {
  title?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: string;
  className?: string;
  disabled?: boolean;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  leftIcon,
  rightIcon,
  onClick,
  type,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-3 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none text-sm ${
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
          : type === "Primary"
            ? "bg-[#1C73E0] hover:bg-white border border-[#1C73E0] text-white hover:text-[#1C73E0] cursor-pointer"
            : type === "Outline"
              ? "border border-[#C8CFD9] bg-white hover:border-[#1C73E0] hover:text-[#1C73E0] cursor-pointer"
              : "text-[#1C73E0] text-base hover:bg-blue-50 cursor-pointer"
      } ${className}`}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {title && <span>{title}</span>}
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default PrimaryButton;
