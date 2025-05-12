import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const backendURL = "http://localhost:8000";

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    fullName: "",
    password: "",
    avatar: null,
    coverImage: null,
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [theme, setTheme] = useState(() => {
    const dark = localStorage.getItem("Dark");
    return dark ? JSON.parse(dark) : true;
  });

  /// TOASTS:
  const SignupNotify = () => {
    toast.success("Signup successful!", {
      position: "top-center",
      autoClose: 1200,
      // hideProgressBar: false,
      // closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      // progress: undefined,
      // theme: theme ? "dark" : "light",
    });
  };

  const ErrorNotify = () => {
    toast.error("Input fields can't be empty.", {
      position: "top-center",
      autoClose: 1200,
      // hideProgressBar: false,
      // closeOnClick: true,
      // pauseOnHover: true,
      // draggable: true,
      // progress: undefined,
      // theme: theme ? "dark" : "light",
    });
  };

  const handleInputs = (e) => {
    if (e.target.type === "file") {
      setData({
        ...data,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "avatar") {
      setAvatar(file);
    } else if (type === "cover") {
      setCoverImage(file);
    }
  };

  const SubmitData = async (e) => {
    e.preventDefault();

    // if (!data.name || !data.email || !data.password) {
    //   ErrorNotify();
    //   return;
    // }

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("username", data.username);
    formData.append("avatar", data.avatar);

    if (data.coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const response = await fetch(`${backendURL}/api/v1/users/register`, {
        method: "POST",
        credentials: "include",
        body: formData,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });

      console.log(response);

      const resData = await response.json();
      const { message, data: user } = resData;

      if (message === "user registered successfully.") {
        SignupNotify();
        localStorage.setItem("userData", JSON.stringify(user));

        navigate("/sign-in");

        setTimeout(() => {
          window.location.reload();
          // document.body.classList.remove("bg-class");
        }, 2000);
      } else {
        ErrorNotify(message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Unlock your world of entertainment. Join the{" "}
          <span className="font-semibold text-blue-600">VideoTube</span>{" "}
          Community!
        </p>

        <form onSubmit={SubmitData} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleInputs}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleInputs}
            required
            value={data.email}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleInputs}
            required
            value={data.fullName}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputs}
            required
            value={data.password}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Choose Avatar:
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              required
              onChange={(e) => setData({ ...data, avatar: e.target.files[0] })}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Choose Cover Image:
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={(e) =>
                setData({ ...data, coverImage: e.target.files[0] })
              }
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Create Your Account
          </button>
        </form>
      </div>
    </div>
  );
};
