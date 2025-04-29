import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//TODO: STYLING!!!!

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
      alert("please provide either username or email");
    }
    // const form = new FormData();

    // form.append("username", data.username);
    // form.append("email", data.email);
    // form.append("password", data.password);

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

      // console.log(response.data)

      if (!response.ok) {
        // const {message, data:user} = resData;
        // localStorage.setItem("userData", JSON.stringify(user));
        // console.log("user logged in successfully");
        // window.location.reload();
        const errorData = await response.json();
        console.log("error from backend", errorData);
        throw new Error(errorData.message || "Login failed");
      }
      const resData = await response.json();
      const { message, data: user } = resData;
      // console.log(resData);

      localStorage.setItem("accessToken", resData.data.accessToken)


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
      alert("error has occured" + error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row, font-poppins">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://source.unsplash.com/random/800x600/?technology)",
          }}
        ></div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold mb-2 text-gray-800">
              Login to your account
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Keep streaming through the VideoTube community
            </p>

            <form onSubmit={SubmitData} className="space-y-4">
              <input
                type="text"
                name="username"
                // className={
                //   theme
                //     ? "username"
                //     : "username email-light light-mode text-light-mode"
                // }
                placeholder="Username or email"
                required
                onChange={handleInputs}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <input
            type="email"
            name="email"
            // className={
            //   theme ? "email" : "email email-light light-mode text-light-mode"
            // }
            placeholder="Email Address"
            required
            onChange={handleInputs}
          /> */}

              <input
                type="password"
                name="password"
                // className={
                //   theme
                //     ? "password"
                //     : "password email-light light-mode text-light-mode"
                // }
                placeholder="Enter your password"
                required
                onChange={handleInputs}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                // className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
              >
                Login in to your account
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
