# 🎬 VideoTube

A full-featured video-sharing platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). Inspired by YouTube, VideoTube allows users to upload, watch, and interact with videos while managing their own channels and content.

## 🚀 Features

### ✅ Completed:
- **User Authentication** (Register/Login/Logout)
- **Dashboard**: Shows total videos, likes, and subscribers
- **Upload Video**: Upload video and thumbnail to Cloudinary
- **Play Video**: Watch videos with interactive UI
- **Like/Unlike Video**
- **Comment System**:
  - Add, update, delete comments
  - Like/Unlike comments
  - Reply to comments
- **Account Settings**: Update channel avatar, name, and cover
- **Responsive UI**

### 🔧 Upcoming Features:
- **Watch History**
- **Liked Videos Page**
- **Playlists (Create/Add/Remove videos)**

## 🛠️ Tech Stack

| Layer      | Technology                      |
|------------|----------------------------------|
| Frontend   | React.js, Axios, Tailwind CSS    |
| Backend    | Node.js, Express.js              |
| Database   | MongoDB (with Mongoose)          |
| Media      | Cloudinary (Video + Thumbnail)   |
| Auth       | JWT (JSON Web Token), Cookies    |

## 📁 Folder Structure
videotube/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # UI Components
│ │ ├── pages/ # Main screens (Home, Watch, Dashboard etc.)
│ │ └── utils/ # Axios config, helper functions
├── server/ # Node + Express backend
│ ├── controllers/ # Logic for API routes
│ ├── routes/ # Express routes
│ ├── models/ # Mongoose models
│ ├── middleware/ # Auth & error handling
│ └── utils/ # Cloudinary config etc.
