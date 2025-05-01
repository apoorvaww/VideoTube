import React, { useState } from "react";
import axios from "axios";

export const UploadVideo = () => {
  const backendURL = "http://localhost:8000";
  const accessToken = localStorage.getItem("accessToken");

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: null,
    video: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("thumbnail", form.thumbnail);
    formData.append("videoFile", form.video);

    try {
      const response = await axios.post(
        `${backendURL}/api/videos/publish-a-video`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Video uploaded successfully!");
      console.log("Upload success", response.data);
      setForm({
        title: "",
        description: "",
        thumbnail: null,
        video: null,
      });
    } catch (err) {
      setMessage("Failed to upload video.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center font-poppins p-6">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Video</h2>
        <p className="text-sm text-gray-600 mb-6">
          Share your content with the world.
        </p>

        {message && (
          <p className={`mb-4 text-center ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Video Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            placeholder="Video Description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          >
          </textarea>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              required
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-white file:text-gray-700 hover:file:bg-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
              required
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:bg-white file:text-gray-700 hover:file:bg-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};
