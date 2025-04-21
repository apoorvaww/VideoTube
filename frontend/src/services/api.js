// frontend/src/services/auth.js

export const loginUser = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
    return data;
  };
  