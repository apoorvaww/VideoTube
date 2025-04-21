import React, { useState } from "react";

export const Signin = () => {
  const backendURL = "http://localhost:8000";

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

    if(!data.username || !data.email) {
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

      if (message === "User logged in successfully.") {
        localStorage.setItem("userData", JSON.stringify(user));
        console.log("User logged in successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.log("Login failed: ", message);
      }
    } catch (error) {
      alert("error has occured" + error.message);
    }
  };

  return (
    <>
      <div>
        <p>Login To Your Account</p>
        <p>
          Unlock Your World of Entertainment, Unlock Your World of
          Entertainment, Join the VideoTube Community
        </p>
      </div>
      <div className="signup-form">
        <form onSubmit={SubmitData}>
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
          />

          <button
            // className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
            type="submit"
          >
            Login in to your account
          </button>
        </form>
      </div>
    </>
  );
};
