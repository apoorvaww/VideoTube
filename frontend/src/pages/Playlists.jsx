import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../Components/DashboardNavbar";

export const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });

  const user = JSON.parse(localStorage.getItem("userData"));
  const accessToken = localStorage.getItem("accessToken");
  const backendURL = "http://localhost:8000";
  const userId = user.user._id;
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(
        `${backendURL}/api/playlist/get-users-playlists/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPlaylists(res.data.data);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    }
  };

  const createPlaylist = async () => {
    try {
      await axios.post(
        `${backendURL}/api/playlist/create-playlist`,
        {
          ...newPlaylist,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNewPlaylist({ name: "", description: "" });
      fetchPlaylists();
    } catch (err) {
      console.error("Failed to create playlist", err);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      await axios.post(
        `${backendURL}/api/playlist/delete-playlist/${playlistId}`,
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchPlaylists();
    } catch (err) {
      console.error("Failed to delete playlist", err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
        <DashboardNavbar user={user.user} />
      <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>

      <div className="mb-8 flex gap-3">
        <input
          className="border p-2 rounded w-48"
          placeholder="Playlist Name"
          value={newPlaylist.name}
          onChange={(e) =>
            setNewPlaylist({ ...newPlaylist, name: e.target.value })
          }
        />
        <input
          className="border p-2 rounded w-64"
          placeholder="Description"
          value={newPlaylist.description}
          onChange={(e) =>
            setNewPlaylist({ ...newPlaylist, description: e.target.value })
          }
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={createPlaylist}
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="border rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden"
          >
            {/* Thumbnail or Preview */}
            <div className="bg-gray-200 h-40 flex items-center justify-center text-gray-500 text-sm">
              {playlist.videos && playlist.videos.length > 0 ? (
                <img
                  src={playlist.videos[0].thumbnail || "/placeholder.jpg"}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : (
                "No Thumbnail"
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 truncate">
                {playlist.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {playlist.description}
              </p>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View Playlist
                </button>
                <button
                  onClick={() => deletePlaylist(playlist._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
