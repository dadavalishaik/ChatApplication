import React, { useState } from "react";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Email: ${email}\nPassword: ${password}`);
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
                {/* --------Logo ----------*/}
                <div style={{ fontSize: "40px", marginBottom: "15px" }}>🌐</div>

                {/*------- Title -----------*/}
                <h2 style={{ fontSize: "22px", fontWeight: "bold", fontFamily: "sans-serif", color: "#222", marginBottom: "6px" }}>
                    Welcome back
                </h2>


                {/* --------Social buttons -------*/}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "20px",
                    }}
                >

                </div>

                <div
                >

                </div>

                {/* --------Form ----------*/}
                <form onSubmit={handleSubmit}>
                    {/* -------Email--------- */}
                    <div style={{ textAlign: "left", marginBottom: "15px" }}>
                        <label
                            style={{ fontFamily: "sans-serif", fontSize: "13px", font: "status-bar", fontWeight: "bold", color: "#444", display: "block", marginBottom: "6px" }}
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: "90%",
                                padding: "12px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/*--------- Password------- */}
                    <div style={{ textAlign: "left", marginBottom: "15px", position: "relative" }}>
                        <label
                            style={{ fontSize: "13px", fontWeight: "bold", fontFamily: "sans-serif", color: "#444", display: "block", marginBottom: "6px" }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "90%",
                                padding: "12px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />

                    </div>



                    {/*-------- Remember me------- */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 0 20px 0" }}>
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember" style={{ fontSize: "13px", color: "#555" }}>
                            Remember for 30 days
                        </label>
                    </div>

                    {/* -----Login button------ */}
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

                {/* --------Signup text------ */}
                <p style={{ marginTop: "18px", fontSize: "13px", color: "#444" }}>
                    Don’t have an account?{" "}
                    <a href="/register" style={{ color: "#6c63ff", textDecoration: "none", fontWeight: "500" }}>
                        Create account
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
