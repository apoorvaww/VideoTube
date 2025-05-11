import React, { useEffect, useState } from "react";
import DashboardNavbar from "../Components/DashboardNavbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SideNavbar } from "../Components";

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
    <div className="bg-gray-100 min-h-screen font-poppins">
      <DashboardNavbar user={user} />
      <div className="flex">
        <div className="hidden md:block w-64">
          <SideNavbar />
        </div>
        <main className="flex-1 p-6">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            {/* Profile Section */}
            <div className="flex items-center gap-6 mb-4">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover shadow-md cursor-pointer"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.fullName}
                </h2>
                <p className="text-gray-500 text-sm">@{user.username}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-xs text-gray-500">
                  Joined on {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-md shadow-sm border-l-4 border-blue-500">
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Total Videos
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalVideos}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md shadow-sm border-l-4 border-green-500">
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Total Likes
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalLikes}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md shadow-sm border-l-4 border-purple-500 relative">
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Subscribers
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalSubscribers}
                </p>
                <button
                  onClick={toggleSubscribers}
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-purple-500 text-white text-xs rounded-full px-2 py-1 hover:bg-purple-600 transition"
                >
                  View
                </button>
                {showSubscribers && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6 relative">
                      <h3 className="text-lg font-semibold mb-4">
                        Subscribers
                      </h3>
                      <button
                        onClick={() => setShowSubscribers(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
                      >
                        ✕
                      </button>
                      <div className="space-y-3 max-h-72 overflow-y-auto">
                        {subscribers.length > 0 ? (
                          subscribers.map((sub) => (
                            <div
                              key={sub._id}
                              className="flex items-center space-x-2 border-b pb-2"
                            >
                              <img
                                src={sub.subscriber.avatar}
                                alt="avatar"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <p className="text-gray-800 font-medium text-sm">
                                {sub.subscriber.fullName}
                              </p>
                              <p className="text-gray-500 text-xs">
                                @{sub.subscriber.username}
                              </p>
                            </div>
                          ))
                        ) : (
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
          </div>

          {/* Videos Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Your Recent Videos
              </h3>
              <Link
                to="/upload-a-video"
                className="inline-flex items-center gap-2 bg-blue-500 text-white text-sm px-3 py-2 rounded-md hover:bg-blue-600 transition"
              >
                <svg
                  className="w-4 h-4"
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
                Upload
              </Link>
            </div>

            {stats.totalVideos === 0 ? (
              <p className="text-gray-500">
                You haven't uploaded any videos yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Link
                    key={video._id}
                    to={`/watch-video/${video._id}`}
                    className="block"
                  >
                    <div className="bg-gray-50 rounded-md overflow-hidden shadow-sm hover:shadow-md transition">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-gray-800 truncate">
                          {video.title}
                        </h4>
                        <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                          {video.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
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
        </main>
      </div>
    </div>
  );
};
