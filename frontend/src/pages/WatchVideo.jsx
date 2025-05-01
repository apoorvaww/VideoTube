import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";
import React from "react";

// adjust if needed

export const WatchVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendURL = "http://localhost:8000";

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await axios.get(`${backendURL}/api/videos/get-video-by-id/${id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log("Response: " , res.data);
      setVideo(res.data.data);
    };

    fetchVideo();
  }, [id]);

  if (!video) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto font-poppins">
      <video
        src={video.videoFile}
        controls
        className="w-full rounded-lg shadow mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h2>
      <div className="flex items-center gap-6 text-gray-600 text-lg mb-4">
        <div className="flex items-center gap-2 cursor-pointer hover:text-red-500">
          <FaHeart />
          <span>{video.likes || 0}</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
          <FaComment />
          <span>{video.comments?.length || 0}</span>
        </div>
      </div>
      <p className="text-gray-700">{video.description}</p>
    </div>
  );
};
