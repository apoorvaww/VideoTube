import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-primary cursor-pointer">VideoTube</div>
        <nav className="space-x-8">
          <Link to="/sign-in" className="text-gray-700 hover:text-blue-500 font-medium">Login</Link>
          <Link to="/register" className="text-gray-700 hover:text-blue-500 font-medium">Signup</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Upload. <span className="text-blue-800">Share.</span> Discover.</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Join creators sharing amazing content.
        </p>
        <div className="space-x-4">
          <Link to="/register">
            <button className="bg-primary text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition">
              Get Started
            </button>
          </Link>
          <Link to="/explore">
            <button className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-blue-300 transition">
              Explore Videos
            </button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload</h3>
              <p className="text-gray-600">Share your content with the world easily.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Comment</h3>
              <p className="text-gray-600">Engage with other creators and their content.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Playlist</h3>
              <p className="text-gray-600">Organize your favorite videos your way.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
              <p className="text-gray-600">Track your videos, likes, and subscribers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

