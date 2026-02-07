import { ReactNode } from "react";

export interface ButtonProps {
  title?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: string;
  className?: string;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  leftIcon,
  rightIcon,
  onClick,
  type,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-3 font-medium tracking-wide  capitalize transition-colors duration-300 transform rounded-lg focus:outline-none text-sm cursor-pointer ${
        type === "Primary"
          ? "bg-[#1C73E0] hover:bg-white border border-[#1C73E0] text-white hover:text-[#1C73E0]"
          : type === "Outline"
            ? "border border-[#C8CFD9] bg-white hover:border-[#1C73E0] hover:text-[#1C73E0]"
            : "text-[#1C73E0] text-base hover:bg-blue-50"
      }  ${className}`}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {title && <span className="sm:block hidden">{title}</span>}
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default PrimaryButton;
