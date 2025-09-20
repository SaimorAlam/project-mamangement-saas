import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {

  return (
    <nav className="bg-white shadow-sm">
      <div className=" mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="Logo.png" alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="text-blue-500 bg-blue-100 hover:bg-blue-500 hover:text-white duration-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
