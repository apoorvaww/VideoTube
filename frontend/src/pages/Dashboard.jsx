import React, { useEffect, useState } from "react";
import DashboardNavbar from "../Components/DashboardNavbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const navigate = useNavigate();

  const backendURL = "http://localhost:8000";
  const accessToken = localStorage.getItem("accessToken");

  // to fetch user's subscribers' list:
  // to fetch current user's information:
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
        // console.log("user data" , userData)
        setUser(userData);

        try {
          const statsRes = await axios.get(
            `${backendURL}/api/dashboard/get-channel-stats/${userData._id}`
          );
          console.log(statsRes);
          setStats(statsRes.data.data);

          const videoRes = await axios.get(
            `${backendURL}/api/dashboard/get-channel-videos/${userData._id}`
          );
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

  // console.log(user)

  useEffect(() => {
    const subscribersList = async () => {
      try {
        // console.log(user._id)
        const res = await axios.get(
          `${backendURL}/api/subscription/user-channel-subscribers/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // console.log("subscriber list response" , res)

        // console.log("subscribers list response: ", res.data.data);
        setSubscribers(res.data.data);
        // console.log("subscribers: " , subscribers)
      } catch (error) {
        console.log(
          "error in feching the subscriber list of current user",
          error
        );
      }
    };
    if (user) {
      subscribersList();
    }
  }, [user]);

  const toggleSubscribers = () => {
    setShowSubscribers((prev) => !prev);
  };

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
        <p className="text-gray-600 text-lg">
          No user data found. Please log in again.
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen font-poppins">
        <p className="text-red-500 text-lg">
          Failed to fetch your channel stats.
        </p>
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar user={user} />
      <div className="font-poppins p-6 bg-gray-50 min-h-screen">
        {/* Profile Section */}
        <div className="flex items-center gap-6 mb-10">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover shadow-md cursor-pointer"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {user.fullName}
            </h2>
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
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalVideos}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-600 mb-2 font-medium">Total Likes</h3>
            <p className="text-3xl font-bold text-green-500">
              {stats.totalLikes}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-600 mb-2 font-medium">Subscribers</h3>
            <p className="text-3xl font-bold text-purple-500">
              {stats.totalSubscribers}
            </p>

            {/* Show Subscribers Button */}
            <button
              onClick={() => setShowSubscribers(true)}
              className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Show Subscribers
            </button>

            {/* Modal Popup */}
            {showSubscribers && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative items-center">
                  <h3 className="text-xl font-semibold mb-4">Subscribers</h3>
                  <button
                    onClick={() => setShowSubscribers(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer ml-5"
                  >
                    ✕
                  </button>
                  <div className="space-y-4 max-h-72 overflow-y-auto">
                    {subscribers.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex items-center space-x-3 border-b pb-2"
                      >
                        <img
                          src={sub.subscriber.avatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <p className="text-gray-800 font-medium">
                          {sub.subscriber.fullName}
                        </p>
                        <p className="text-gray-800 font-medium">
                          {sub.subscriber.username}
                        </p>
                      </div>
                    ))}
                    {subscribers.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No subscribers found.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-800">
            Your Uploaded Videos
          </h3>
          <Link
            to="/upload-a-video"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Video
          </Link>
        </div>

        {/* Videos List */}
        <div>
          {stats.totalVideos === 0 ? (
            <p className="text-gray-500">
              You haven't uploaded any videos yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <Link
                  key={video._id}
                  to={`/watch-video/${video._id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-800 truncate">
                        {video.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {video.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-3">
                        Uploaded on{" "}
                        {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
