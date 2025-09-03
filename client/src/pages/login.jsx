import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};

    // Email validation
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid";
    }

    // Password validation
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      console.log("Login success:", res.data);

      // Save token
      localStorage.setItem("token", res.data.firebaseUser.idToken);

      // Redirect to ChatApp
      navigate("/chat");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f8ff",
        minHeight: "90vh",
        padding: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ fontSize: "40px", marginBottom: "15px" }}>🌐</div>

        {/* Title */}
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            color: "#222",
            marginBottom: "6px",
          }}
        >
          Welcome back
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label
              style={{
                fontFamily: "sans-serif",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#444",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Email address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "90%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
              }}
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                fontFamily: "sans-serif",
                color: "#444",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "90%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
              }}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>
            )}
          </div>

          {/* Remember me */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "10px 0 20px 0",
            }}
          >
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" style={{ fontSize: "13px", color: "#555" }}>
              Remember for 30 days
            </label>
          </div>

          {/* Login button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(to right, #7b5fff, #6c63ff)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        {/* Signup link */}
        <p style={{ marginTop: "18px", fontSize: "13px", color: "#444" }}>
          Don’t have an account?{" "}
          <a
            href="/register"
            style={{ color: "#6c63ff", textDecoration: "none", fontWeight: "500" }}
          >
            Create account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;








