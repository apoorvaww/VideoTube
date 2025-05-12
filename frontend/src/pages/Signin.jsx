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
        throw new Error(errorData.message || "Login failed");
      }

      const resData = await response.json();
      const { message, data: user } = resData;

      localStorage.setItem("accessToken", resData.data.accessToken);

      if (message === "User logged in successfully.") {
        localStorage.setItem("userData", JSON.stringify(user));
        setTimeout(() => {
          window.location.reload();
        }, 2000);

        navigate("/dashboard");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Continue your journey with{" "}
          <span className="font-semibold text-blue-600">VideoTube</span>
        </p>

        <form onSubmit={SubmitData} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            required
            onChange={handleInputs}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            onChange={handleInputs}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login to your account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          New to VideoTube?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};
