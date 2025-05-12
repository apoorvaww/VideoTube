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



## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/videotube.git
cd videotube
```
2. Install Dependencies
Backend
```
cd backend
npm install
```
3. Configure Environment Variables
Create a .env file inside the server folder and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the App
Backend
```
cd backend
nodemon src/index.js
```
Frontend
```
cd frontend
npm run dev
```


🔐 Authentication Flow:
JWT is used for generating and validating tokens.
Tokens are stored in HTTP-only cookies for security.
Protected routes are guarded usingmiddleware.


🌩️ Media Upload with Cloudinary:
Videos and thumbnails are uploaded from the frontend.
Cloudinary securely stores the files and returns public URLs.\
These URLs are saved in MongoDB with the rest of the video metadata.






