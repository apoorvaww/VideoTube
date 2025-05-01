import React, { useEffect, useState,  } from "react";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";

export const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);

  const backendURL = 'http://localhost:8000';
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/v1/users/get-current-user`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const { fullName, email, username, avatar, coverImage } = res.data.data;
        setFormData({ fullName, email, username });
        setPreviewAvatar(avatar);
        setPreviewCover(coverImage);
      } catch (err) {
        toast.error("Failed to fetch user data");
      }
    };

    fetchUser();
  }, []);

  const handleTextChange = async (e) => {
    setFormData(
      {
        ...formData,
        [e.target.name]: e.target.value
      }
    );
  }

  const handleFinalUpdate = () => {
    navigate('/dashboard')
  }

  const handleUpdate = async (e) => {
    // the submit button when i update the username, fullname etc.
    
    try {
      const updatedInfo = await axios.patch(`${backendURL}/api/v1/users/update-account-details`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      } )
      console.log("User info updated: " + updatedInfo);
      
    } catch (error) {
      console.log("error occurred while patch request for username etc." + error)
    }
    
  }

  const handleAvatarUpload = async(e) => {
    if(!avatarFile) {
      console.log("no avatar file selected")
      return;
    }
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      const updatedAvatar = await axios.patch(`${backendURL}/api/v1/users/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`
        }
      })
      // console.log("updated avatar" , updatedAvatar)
      console.log("updated avatar successfully" , updatedAvatar)
    } catch (error) {
      console.log("error occurred while updating the avatar" + error)
    }
  }
 
  const handleCoverUpload = async (e) => {
    if(!coverFile) {
      console.log("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append("coverImage", coverFile); // key must match backend's `req.file` field
  
    try {
      const response = await axios.patch(
        `${backendURL}/api/v1/users/update-cover-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`, // ✅ no colon after Bearer
          },
        }
      );
      console.log("Cover image updated successfully", response.data);
    } catch (error) {
      console.error("Error while updating cover image", error);
    }
  };
  
 

  return (
    <div className="max-w-4xl mx-auto p-6 font-poppins">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Profile Settings</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleFinalUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleTextChange}
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleTextChange}
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleTextChange}
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Update Info
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avatar Upload */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Avatar</h3>
          {previewAvatar && (
            <img src={previewAvatar} alt="Avatar" className="w-30 h-30 rounded-full mb-4 border-1" />
          )}
          <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} className="bg-gray-100 px-4 py-3" />
          <button
            onClick={handleAvatarUpload}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Change Avatar
          </button>
        </div>

        {/* Cover Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Cover Image</h3>
          {previewCover && (
            <img src={previewCover} alt="Cover" className="w-full h-full object-cover mb-4 rounded" />
          )}
          <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} />
          <button
            onClick={handleCoverUpload}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Change Cover Image
          </button>
        </div>
        <button
          onClick={handleFinalUpdate}
          className="mt-30 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Account
        </button>
      </div>
    </div>
  );
};

