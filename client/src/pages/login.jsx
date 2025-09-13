import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebase"
import { connectSocket } from "../components/socket";
import chatImg from "../assets/chat.png"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};

    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid";
    }

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

    try {
      // ✅ Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Get ID token
      const token = await user.getIdToken();
      localStorage.setItem("idToken", token);

      // connect socket after login
      connectSocket(token);

      // ✅ Call backend if required
      const res = await axios.post("http://localhost:5000/login", { email, password });

      console.log("Backend login success:", res.data);
      console.log("Firebase user:", user.email);
      console.log("Stored token:", token);

      navigate("/chat");
    } catch (err) {
      console.error("Login failed:", err.message);
      alert("Login failed: " + err.message);
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
          boxShadow: "0px 10px 30px rgba(142, 45, 226, 0.2)",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center",
        }}
      >
        <img src={chatImg} alt="chat icon" style={{ width: "90px", height: "90px" }} />
        <h2
          style={{
            fontSize: "22px",
            fontFamily: 'Lato,sans-serif',
            color: "#222",
            marginBottom: "12px",
          }}
        >
          WELCOME
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <div style={{ position: "relative", width: "90%", marginBottom: "20px" }}>
              <label
                style={{
                  position: "absolute",
                  top: "-8px",
                  left: "12px",
                  background: "#fff",
                  padding: "0 2px",
                  fontFamily: 'Lato,sans-serif',
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#444",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 12px 12px 12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: 'Lato,sans-serif'
                }}
              />
              {errors.email && (
                <span style={{ color: "red", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  {errors.email}
                </span>
              )}
            </div>

            {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div style={{ position: "relative", textAlign: "left", marginBottom: "15px" }}>
            <label
              style={{
                position: "absolute",
                top: "-8px",
                left: "12px",
                background: "#fff",
                padding: "0 4px",
                fontFamily: 'Lato,sans-serif',
                fontSize: "13px",
                fontWeight: "bold",
                color: "#444",
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
                padding: "16px 12px 12px 12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                fontFamily: 'Lato,sans-serif'
              }}
            />
            {errors.password && <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "10px 0 20px 0",
            }}
          >
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" style={{ fontSize: "13px", color: "#555", fontFamily: 'Lato,sans-serif', }}>
              Remember for 30 days
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: "50%",
              padding: "12px",
              background: "linear-gradient(to right, #ff6ec4, #5b8def, #8e2de2)",
              color: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              fontFamily: 'Lato,sans-serif',
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "18px", fontSize: "13px", color: "#444", fontFamily: 'Lato,sans-serif', }}>
          Don’t have an account?{" "}
          <a href="/register" style={{ fontFamily: 'Lato,sans-serif', color: "#6c63ff", textDecoration: "none", fontWeight: "500" }}>
            Create account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;





