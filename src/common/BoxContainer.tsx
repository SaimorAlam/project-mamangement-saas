import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}
const BoxContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="border border-[#E2E8F0] bg-[#FFF] rounded-lg p-6 w-full">
      {children}
    </div>
  );
};

export default BoxContainer;
