import React, { useState } from "react";
import { FiBell, FiLogOut, FiX } from "react-icons/fi";
import { MdOutlineQuiz, MdOutlineHome } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    return navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative min-h-screen flex">
      {/* Hamburger Menu */}
      <div className={`lg:hidden ${isOpen ? "hidden" : "block"}`}>
        <button
          className="text-gray-800 hover:text-gray-600 focus:outline-none mt-4 ml-4"
          onClick={toggleSidebar}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 overflow-y-auto transition duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0 p-4 ${
          isOpen ? "m-4 rounded-md" : ""
        } z-50`}
      >
        <div className="flex items-center justify-between mt-8">
          <span className="text-white text-2xl font-semibold uppercase">
            Weekly Treasure
          </span>
          {/* Close Icon (visible only on mobile screens) */}
          <button
            className={`text-gray-500 hover:text-gray-400 focus:outline-none ${
              isOpen ? "block" : "hidden"
            } lg:hidden`}
            onClick={toggleSidebar}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-10">
          <Link to="/">
            <p className="flex items-center text-lg py-2 px-4 text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 rounded">
              <span className="mx-4">
                <MdOutlineQuiz />
              </span>
              <span>Quizzes</span>
            </p>
          </Link>
          <Link to="/users">
            <p className="flex items-center text-lg py-2 px-4 text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 rounded">
              <span className="mx-4">
                <AiOutlineUser />
              </span>
              <span>User</span>
            </p>
          </Link>
          <Link to="/notification">
            <p className="flex items-center text-lg py-2 px-4 text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 rounded">
              <span className="mx-4">
                <FiBell />
              </span>
              <span>Notifications</span>
            </p>
          </Link>
          <p
            className="flex items-center text-lg py-2 px-4 text-gray-200 hover:bg-gray-700 hover:bg-opacity-50 rounded"
            onClick={handleLogout}
          >
            <span className="mx-4">
              <FiLogOut />
            </span>
            <span>Logout</span>
          </p>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
