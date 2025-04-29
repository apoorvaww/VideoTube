import React from 'react';
import { Link } from 'react-router-dom'; // For navigation
import { useState } from 'react';

export const Navbar = () => {
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState(true);

  // to handle the avatar image:
  const[avatar, setAvatar] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Handle the search (maybe call a search API or filter items locally)
    console.log('Searching for:', search);
  };

  return (
    <nav className="bg-white shadow-md p-4 dark:bg-gray-800">
  <div className="flex justify-between items-center">
    {/* Logo */}
    <Link to="/" className="text-xl font-semibold text-gray-800 dark:text-white">
      VideoTube
    </Link>

    {/* Search Bar */}
    <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full max-w-xs md:max-w-sm">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search videos"
        className="p-1.5 border rounded-md dark:bg-gray-700 dark:text-white w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Search
      </button>
    </form>

    {/* Navigation Links */}
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/" className="text-gray-800 dark:text-white hover:text-blue-500">
        Home
      </Link>
      <Link to="/upload" className="text-gray-800 dark:text-white hover:text-blue-500">
        Upload
      </Link>
      <Link to="/profile" className="text-gray-800 dark:text-white hover:text-blue-500">
        Profile
      </Link>

      {/* User Avatar */}
      <div className="relative">
        <img
          src="https://randomuser.me/api/portraits/men/44.jpg"
          alt="User Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
        />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(!theme)}
        className="text-gray-800 dark:text-white p-2 rounded-full"
      >
        {theme ? '🌞' : '🌙'}
      </button>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
