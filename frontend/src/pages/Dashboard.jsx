import React, { useEffect, useState } from "react";
import axios from "axios";

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendURL = "http://localhost:8000";
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await axios.get(
          `${backendURL}/api/v1/users/get-current-user`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const userData = userResponse.data.data;
        setUser(userData);

        try {
          const statsRes = await axios.get(`${backendURL}/api/dashboard/get-channel-stats/${userData._id}`);
          setStats(statsRes.data.data);

          const videoRes = await axios.get(`${backendURL}/api/dashboard/get-channel-videos/${userData._id}`);
          setVideos(videoRes.data.data);
        } catch (error) {
          console.error("Error fetching stats/videos:", error);
        }
      } catch (err) {
        setError(err);
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchAllData();
    } else {
      setLoading(false);
      setError(new Error("Access Token is missing. Please log in."));
    }
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen font-poppins">
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen font-poppins">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen font-poppins">
        <p className="text-gray-600 text-lg">No user data found. Please log in again.</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen font-poppins">
        <p className="text-red-500 text-lg">Failed to fetch your channel stats.</p>
      </div>
    );
  }

  return (
    <div className="font-poppins p-6 bg-gray-50 min-h-screen">
      {/* Profile Section */}
      <div className="flex items-center gap-6 mb-10">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{user.fullName}</h2>
          <p className="text-gray-500">@{user.username}</p>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">
            Joined on {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-600 mb-2 font-medium">Total Videos</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalVideos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-600 mb-2 font-medium">Total Likes</h3>
          <p className="text-3xl font-bold text-green-500">{stats.totalLikes}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-gray-600 mb-2 font-medium">Subscribers</h3>
          <p className="text-3xl font-bold text-purple-500">{stats.totalSubscribers}</p>
        </div>
      </div>

      {/* Videos List */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Uploaded Videos</h3>
        {stats.totalVideos === 0 ? (
          <p className="text-gray-500">You haven't uploaded any videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video._id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">{video.title}</h4>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{video.description}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    Uploaded on {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
