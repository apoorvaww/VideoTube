import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import ReplyList from "../Components/ReplyList";
import React from "react";

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
  // for updating and deleting the comments:
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showMenu, setShowMenu] = useState({});

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
  }, [id, accessToken]); // Removed 'comments' from dependency array to avoid potential infinite loops

  //use effect to fetch the number of initial likes on a comment:
  useEffect(() => {
    const initialLikes = {};
    if (Array.isArray(comments)) {
      comments.forEach((comment) => {
        initialLikes[comment._id] = comment.likes?.length || 0;
      });
      setLikesonComment(initialLikes);
    }
  }, [comments]);

  const toggleLikeOnVideo = async () => {
    try {
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

      const { likeCount } = res.data.data;

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
      const res = await axios.get(
        `${backendURL}/api/like/total-likes-on-video/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLikesOnVideo(res.data.data);
    } catch (error) {
      console.log("error in fetching the likes on video", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
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
      // Re-fetch comments to update the UI
      const res = await axios.get(
        `${backendURL}/api/comments/get-video-comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments(res.data.data);
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

  const handleUpdateComment = async (commentId) => {
    try {
      const res = await axios.post(
        `${backendURL}/api/comments/update-comment/${commentId}`,
        { newComment: editContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.status === 200) {
        const updated = res.data.data;
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? { ...comment, content: updated.content }
              : comment
          )
        );
      }
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("error updating comments:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.post(
        `${backendURL}/api/comments/delete-comment/${commentId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Re-fetch comments to update the UI
      const res = await axios.get(
        `<span class="math-inline">\{backendURL\}/api/comments/get\-video\-comments/</span>{id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments(res.data.data);
    } catch (error) {
      console.error("error in deleting comment: ", error);
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
            {/* <FaComment className="text-lg" /> */}
            <span>{video.comments?.length || 0} Comments</span>
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
        <div className="space-y-6">
          {comments?.map((comment, index) => (
            <div
              key={comment._id}
              className="bg-white p-5 rounded-lg shadow-sm flex gap-4"
            >
              <img
                src={comment.owner.avatar}
                alt={comment.owner.username || "User Avatar"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">
                      {comment.owner.username || "Anonymous"}
                    </p>
                    {editingCommentId === comment._id ? (
                      <div className="mt-1 flex gap-2">
                        <input
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleUpdateComment(comment._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md px-3 py-2 font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="text-gray-500 hover:text-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm mt-1">
                        {comment.content}
                      </p>
                    )}
                  </div>

                  {/* Three dots button */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowMenu((prev) => ({
                          ...prev,
                          [comment._id]: !prev[comment._id],
                        }))
                      }
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    {showMenu[comment._id] && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditContent(comment.content);
                            setShowMenu({});
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-red-100 text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => handleAddReply(comment._id)}
                    className="mt-1 bg-blue-600 text-white px-3 py-1 rounded hover:opacity-90 text-sm"
                  >
                    Reply
                  </button>
                </div>

                {/* Replies Section */}
                {showReplies[comment._id] && (
                  <div className="ml-8 mt-2">
                    <ReplyList replies={replies[comment._id]} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {comments?.length === 0 && (
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
