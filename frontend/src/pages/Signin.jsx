import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const backendURL = "http://localhost:8000";
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputs = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    console.log("Data being sent: ", data);

    if (!data.username && !data.email) {
      alert("Please provide either username or email");
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: data.username || undefined,
          email: data.email || undefined,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("error from backend", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const resData = await response.json();
      const { message, data: user } = resData;

      localStorage.setItem("accessToken", resData.data.accessToken);

      if (message === "User logged in successfully.") {
        localStorage.setItem("userData", JSON.stringify(user));
        console.log("User logged in successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);

        navigate("/dashboard");
      } else {
        console.log("Login failed: ", message);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-poppins bg-white">
      {/* Left Side Image */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://source.unsplash.com/800x600/?technology,media)",
        }}
      ></div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back</h2>
          <p className="text-gray-600 mb-8 text-sm">
            Continue your journey with VideoTube
          </p>

          <form onSubmit={SubmitData} className="space-y-6">
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              required
              onChange={handleInputs}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              onChange={handleInputs}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold bg-blue-800 hover:bg-primary-dark transition duration-200"
            >
              Login to your account
            </button>
          </form>

          {/* Optional small text */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            New to VideoTube?{" "}
            <a href="/signup" className="text-blue-500 font-medium hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
