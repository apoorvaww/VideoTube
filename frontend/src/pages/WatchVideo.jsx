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
  const [comments, setComments] = useState([]);
  const [likesOnVideo, setLikesOnVideo] = useState(0);
  const [likesOnComment, setLikesonComment] = useState(0);

  const backendURL = "http://localhost:8000";

  const accessToken = localStorage.getItem("accessToken");

  const user = JSON.parse(localStorage.getItem("userData"));
// console.log( user.user._id)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/api/videos/get-video-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // console.log("Video Response: ", res.data.data);
        setVideo(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch video ", error);
        setLoading(false);
      }
    };

    if (id) {
      videoLikes(id);
    }

    fetchVideo();
  }, [id]);

  useEffect(() => {
    comments.forEach((comment) => {
      commentLikes(comment._id);
    });
  }, [comments]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${backendURL}/api/comments/get-video-comments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // console.log("comments response: ", res.data.data);
        setComments(res.data.data);
      } catch (error) {
        console.error("failed to fetch comments", error);
      }
    };

    fetchComments();
  }, [id]);


  // to handle the toggle like on comment:
  const toggleLikeOnComment = async (commentId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${backendURL}/api/like/toggle-comment-like/${commentId}`,
        {
          userId: user.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res.data);

      const action = res.data.message.toLowerCase();

      setLikesonComment((prev) => {
        const currentCount = prev[commentId] || 0;
        const updatedCount = action.includes("removed") && currentCount > 0?currentCount - 1 : currentCount + 1;

        return{
          ...prev,
          [commentId]: updatedCount,
        }
      })

    } catch (error) {
      console.log("error in toggling comment like", error)
    }
  };

  const toggleLikeOnVideo = async(videoId) => {

  }

  const videoLikes = async (videoId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${backendURL}/api/like/total-likes-on-video/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // console.log(res.data);
      setLikesOnVideo(res.data.data);
    } catch (error) {
      console.log("error in fetching the likes on video", error);
    }
  };

  const commentLikes = async (videoId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${backendURL}/api/like/total-likes-on-comment/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(res.data.data);
      setLikesonComment(res.data.data);
    } catch (error) {
      console.log("error in fetching the likes on comments", error);
    }
  };

  if (!video) return <p className="text-center items-cent">Loading...</p>;

  if (loading) {
    return <p className="text-center items-center">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto font-poppins">
      <video
        src={video.videoFile}
        controls
        className="w-full rounded-lg shadow mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h2>
      <div className="flex items-center gap-6 text-gray-600 text-lg mb-4">
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src={video.owner.avatar}
            alt=""
            className="h-15 w-15 rounded-full border-1 "
          />
          <span className="text-black">{video.owner.username}</span>
        </div>
        <div className="flex items-center gap-3 cursor-pointer hover:text-red-500">
          <FaHeart />
          {likesOnVideo !== null && <span>{likesOnVideo}</span>}
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
          <FaComment />
          <span>{video.comments?.length || 0}</span>
        </div>
        <div className="gap-4 cursor-pointer ">
          <button className="bg-red-400 ">Subscribe</button>
        </div>
      </div>
      <p className="text-gray-700 mb-6">{video.description}</p>

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Comments ({comments?.length || 0})
        </h3>
        <div>
          <button>Add Comment</button>
        </div>
        <div className="space-y-4">
          {comments?.map((comment, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-sm  gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={comment.owner.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <p className="text-gray-500 font-medium">
                  {comment.owner.username || "Anonymous"}
                </p>
              </div>
              <div className="items-center p-3">
                <p className="text-black">{comment.content}</p>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <button
                  onClick={() => toggleLikeOnComment(comment._id)}
                  className="cursor-pointer"
                >
                  <FaHeart className="text-gray-500 hover:text-red-500" />
                </button>
                {typeof likesOnComment == "number" && (
                  <span>{likesOnComment || 0}</span>
                  
                )}
              </div>
            </div>
          ))}
          {video.comments?.length === 0 && (
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
