import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";
import React from "react";
import ReplyList from "../Components/ReplyList";

// adjust if needed

export const WatchVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [likesOnVideo, setLikesOnVideo] = useState(0);
  const [likesOnComment, setLikesonComment] = useState({});
  const [newComment, setNewComment] = useState("");
  // for reply to comments:
  const [replyContent, setReplyContent] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [replies, setReplies] = useState({});

  const navigate = useNavigate();

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

  // useEffect(() => {
  //   comments.forEach((comment) => {
  //     setLikesonComment(comment._id);
  //   });
  // }, [comments]);

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
  }, [comments]);

  //use effect to fetch the number of initiallikes on a comment:
  useEffect(() => {
    const initialLikes = {};
    comments.forEach((comment) => {
      console.log(comment);
      initialLikes[comment._id] = comment.likes?.length || 0;
    });
    setLikesonComment(initialLikes);
  }, [id]);

  useEffect(() => {
    const fetchAllCommentLikes = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${backendURL}/api/like/total-likes-on-comment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(res.data.data);
      } catch (error) {
        console.log("error in fetching comments likes", error);
      }
    };
    if (id) {
      fetchAllCommentLikes();
    }
  }, [id]);

  // to handle the toggle like on comment:
  const toggleLikeOnVideo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${backendURL}/api/like/toggle-video-like/${video._id}`,
        {
          userId: user.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const action = res.data.message;
      setLikesOnVideo((prevCount) => {
        if (action.includes("Removed") && prevCount > 0) {
          return prevCount - 1;
        } else if (action.includes("Liked")) {
          return prevCount + 1;
        }
        return prevCount;
      });
    } catch (error) {
      console.log("Error toggling like on video", error);
    }
  };

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

      // console.log(res)

      const { likeCount } = res.data.data;
      console.log(likeCount);

      setLikesonComment((prev) => {
        return {
          ...prev,
          [commentId]: likeCount,
        };
      });
    } catch (error) {
      console.log("error toggling comment's like: ", error);
    }
  };

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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${backendURL}/api/comments/add-comment/${id}`,
        {
          content: newComment,
          userId: user.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNewComment("");
    } catch (error) {
      console.log("failed to add comment: ", error);
    }
  };

  const handleAddReply = async (parentCommentId) => {
    if (!replyContent[parentCommentId]) return;

    try {
      const res = await axios.post(
        `${backendURL}/api/comments/add-reply-to-comment/${parentCommentId}`,
        {
          videoId: id,
          content: replyContent[parentCommentId],
          parentComment: parentCommentId,
          userId: user.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(res.data.data);
      const newReply = res.data.data;

      setReplies((prev) => ({
        ...prev,
        [parentCommentId]: prev[parentCommentId]
          ? [...prev[parentCommentId], newReply]
          : [newReply],
      }));

      setReplyContent((prev) => ({
        ...prev,
        [parentCommentId]: "",
      }));

      setShowReplies((prev) => ({
        ...prev,
        [parentCommentId]: true,
      }));
    } catch (error) {
      console.error("failed to add reply", error);
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const res = await axios.get(
        `${backendURL}/api/comments/get-comment-replies/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(res.data.data);

      setReplies((prev) => ({
        ...prev,
        [commentId]: res.data.data,
      }));
      setShowReplies((prev) => ({
        ...prev,
        [commentId]: true,
      }));
    } catch (error) {
      console.error("error fetching replies", error);
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
      <div className="flex items-center gap-10 text-gray-600 text-lg mb-4">
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src={video.owner.avatar}
            alt=""
            className="h-15 w-15 rounded-full border-1"
            onClick={() => navigate("/dashboard")}
          />
          <div>
            <p
              className="text-black font-semibold"
              onClick={() => navigate("/dashboard")}
            >
              {video.owner.username}
            </p>
            <p className="text-xs text-gray-500">1.2M subscribers</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-gray-700 text-sm">
          <div className="flex items-center gap-1 cursor-pointer hover:text-red-600 transition">
            <FaHeart className="text-lg" onClick={toggleLikeOnVideo} />
            {likesOnVideo !== null && <span>{likesOnVideo}</span>}
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition">
            <FaComment className="text-lg" />
            <span>{video.comments?.length || 0}</span>
          </div>
          <div>
            <button className="bg-black text-white px-4 py-2 rounded-full hover:opacity-90 transition cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-6">{video.description}</p>

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Comments ({comments?.length || 0})
        </h3>
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>
        <div className="space-y-4">
          {comments?.map((comment, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-sm gap-3"
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

              {/* Like and Reply button */}
              <div className="flex items-center gap-4 text-gray-600 mt-2">
                <button onClick={() => toggleLikeOnComment(comment._id)}>
                  <FaHeart className="text-gray-500 hover:text-red-500" />
                </button>
                <span>{likesOnComment?.[comment._id] || 0}</span>

                <button
                  className="text-blue-600 text-sm"
                  onClick={async () => {
                    if (!showReplies[comment._id]) {
                      await fetchReplies(comment._id);
                    } else {
                      setShowReplies((prev) => ({
                        ...prev,
                        [comment._id]: !prev[comment._id],
                      }));
                    }
                  }}
                >
                  {showReplies[comment._id] ? "Hide Replies" : "View Replies"}
                </button>
              </div>

              {/* Reply Input */}
              <div className="mt-2">
                <input
                  type="text"
                  value={replyContent[comment._id] || ""}
                  onChange={(e) =>
                    setReplyContent((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => handleAddReply(comment._id)}
                  className="mt-1 bg-blue-600 text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Reply
                </button>
              </div>

              {/* Replies Section */}
              {showReplies[comment._id] && (
                <ReplyList replies={replies[comment._id]} />
              )}
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
