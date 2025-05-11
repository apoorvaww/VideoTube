import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaListUl,
  FaYoutube,
  FaHistory,
  FaClock,
  FaThumbsUp,
  FaCog,
} from "react-icons/fa";
// import logo from "../assets/your-logo.png"; // Replace with your actual logo path

export const SideNavbar= () => {
  return (
    <aside className="bg-gray-900 text-gray-100 w-64 min-h-screen py-8 px-4 flex flex-col">
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 font-semibold" : ""
                }`
              }
            >
              <FaHome className="mr-3 text-lg" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 font-semibold" : ""
                }`
              }
            >
              <FaTachometerAlt className="mr-3 text-lg" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/playlists"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 font-semibold" : ""
                }`
              }
            >
              <FaListUl className="mr-3 text-lg" />
              <span>Playlists</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/subscriptions"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 font-semibold" : ""
                }`
              }
            >
              <FaYoutube className="mr-3 text-lg" />
              <span>Subscriptions</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 font-semibold" : ""
                }`
              }
            >
              <FaHistory className="mr-3 text-lg" />
              <span>History</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/watch-later"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 font-semibold" : ""
                }`
              }
            >
              <FaClock className="mr-3 text-lg" />
              <span>Watch Later</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/liked-videos"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md hover:bg-gray-800 ${
                  isActive ? "bg-gray-800 font-semibold" : ""
                }`
              }
            >
              <FaThumbsUp className="mr-3 text-lg" />
              <span>Liked Videos</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="mt-8 border-t border-gray-800 pt-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md hover:bg-gray-800 ${
              isActive ? "bg-gray-800 font-semibold" : ""
            }`
          }
        >
          <FaCog className="mr-3 text-lg" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

// export default SideNavbar