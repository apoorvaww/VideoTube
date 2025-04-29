import React, { useEffect, useState } from "react";
import axios from "axios";

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const backendURL = "http://localhost:8000";
  const accessToken = localStorage.getItem("accessToken");

  // console.log(accessToken)

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear any previous errors
      try {
        const userResponse = await axios.get(
          `${backendURL}/api/v1/users/get-current-user`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // console.log(userResponse);

        const userData = userResponse.data.data; // Store user data
        // console.log(userData)
        setUser(userData); //set user
        // console.log(userData._id)

        try {
          const statsRes = await axios.get(`${backendURL}/api/dashboard/get-channel-stats/${userData._id}`)
          console.log(statsRes.data.data)
          setStats(statsRes.data.data)
          const videoRes = await axios.get(`${backendURL}/api/dashboard/get-channel-videos/${userData._id}`)
          console.log(videoRes.data.data[0])
          setVideos(videoRes.data.data)
        } catch (error) {
          
        }
      } catch (err) {
        setError(err); // Set error state
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false); // Finish loading
      }
    };

    if (accessToken) {
      // Only fetch if accessToken exists
      fetchAllData();
    } else {
      setLoading(false);
      setError(new Error("Access Token is missing. Please log in."));
    }
  }, [accessToken]); // Dependency on accessToken

  if (loading) {
    return (
      <div className="text-center font-poppins p-6">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center font-poppins p-6 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center font-poppins p-6">
        No data available. This could be due to an issue with your login.
      </div>
    );
  }

  if(!stats) {
    return(
      <div>Failed to fetch stats of data</div>
    )
  }

  return (
    <div className="font-poppins p-4">
      {/* Profile: */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-semibold">{user.fullName}</h2>
          <p className="text-gray-500">@{user.username}</p>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-700">
            Joined on {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats: */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Videos:</h3>
          <p className="text-xl font-bold text-blue-600">{stats.totalVideos}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Likes:</h3>
          <p className="text-xl font-bold text-green-600">{stats.totalLikes}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Subscribers:</h3>
          <p className="text-xl font-bold text-purple-600">
            {stats.totalSubscribers}
          </p>
        </div>
      </div>

      {/* Videos List: */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Your Videos:
        </h3>
        {stats.totalVideos === 0 ? (
          <p className="text-gray-500">You haven't uploaded any videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="bg-white p-4 rounded-lg shadow">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h4 className="text-lg font-semibold text-gray-800">
                  {video.title}
                </h4>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {video.description}
                </p>
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
