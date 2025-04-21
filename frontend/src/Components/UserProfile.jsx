import React, { useState, useEffect } from "react";
import axios from "../axios"; // Import the axios instance

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from the backend
    axios.get("/api/v1/users") // Replace with your user API endpoint
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>{user.email}</p>
      {/* Display more user data */}
    </div>
  );
};

export default UserProfile;
