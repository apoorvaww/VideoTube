import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = () => {
  const backendURL = "http://localhost:8000";

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
    if(e.target.type === "file"){
      setData({
        ...data,
        [e.target.name]: e.target.files[0]
      });
    }else{
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  }

  const handleFileChange = (e,type) => {
    const file = e.target.files[0];
    if(type === "avatar") {
      setAvatar(file);
    }
    else if(type === "cover") {
      setCoverImage(file);
    }
  }

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
    formData.append("avatar", data.avatar)
    
    if(data.coverImage) {
      formData.append("coverImage", coverImage)
    }


    try {
      const response = await fetch(`${backendURL}/api/v1/users/register`, {
        method: "POST",
        credentials: "include",
        body: formData
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });

      console.log(response);

      const resData = await response.json();
      const {message, data: user} = resData;

      if (message === "user registered successfully.") {
        SignupNotify();
        localStorage.setItem("userData", JSON.stringify(user));

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
    <>
      <div className="above-data">
        <p className="signup-head">
            Create Your Account
        </p>
        <p className="signup-desc">
          Unlock Your World of Entertainment, Unlock Your World of
          Entertainment, Join the VideoTube Community
        </p>
      </div>
      <div className="signup-form">
        <form onSubmit={SubmitData}>
          <input
            type="text"
            name="username"
            className={
              theme
                ? "username"
                : "username email-light light-mode text-light-mode"
            }
            placeholder="Username"
            required
            onChange={handleInputs}
          />
          <input
            type="email"
            name="email"
            className={
              theme ? "email" : "email email-light light-mode text-light-mode"
            }
            placeholder="Email Address"
            required
            onChange={handleInputs}
          />
          <input
            type="text"
            name="fullName"
            className={
              theme ? "email" : "email email-light light-mode text-light-mode"
            }
            placeholder="Full Name"
            required
            onChange={handleInputs}
          />
          <input
            type="password"
            name="password"
            className={
              theme
                ? "password"
                : "password email-light light-mode text-light-mode"
            }
            placeholder="Passcode"
            required
            onChange={handleInputs}
          />
          <input
            type="file"
            name="avatar"
            // className={
            //   theme
            //     ? "password"
            //     : "password email-light light-mode text-light-mode"
            // }
            accept="image/*"
            placeholder="Avatar Image"
            required
            onChange={(e) => setData({...data, avatar: e.target.files[0]})}
          />
          <input
            type="file"
            name="coverImage"
            // className={
            //   theme
            //     ? "password"
            //     : "password email-light light-mode text-light-mode"
            // }
            accept="image/*"
            placeholder="Cover Image"
            onChange={(e) => setData({...data, coverImage: e.target.files[0]})}
          />
          <button
            className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
            type="submit"
          >
            Create Your Account
          </button>
        </form>
      </div>
    </>
  );
}

// export default Register;
