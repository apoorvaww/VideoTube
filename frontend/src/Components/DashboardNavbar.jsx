import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    navigate("/sign-in");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log(user)

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between font-poppins relative">
      {/* Left: Brand */}
      <div
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        VideoTube
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-700 font-medium">
            Welcome, {user?.fullName?.split(" ")[0]}
          </p>
          <p className="text-xs text-gray-500">@{user.username}</p>
        </div>

        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)}
        />

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-16 w-48 bg-white shadow-md rounded-md border z-50">
            <button
              onClick={() => {
                navigate("/profile-settings");
                setDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Update Account
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardNavbar
