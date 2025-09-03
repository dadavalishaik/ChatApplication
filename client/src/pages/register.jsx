import React, { useState } from "react";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import axios from "axios";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/register", {
                email,
                password,

            });

            setMessage("Registration successful!");
            console.log(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
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
                {/* --------Logo ----------*/}
                <div style={{ fontSize: "40px", marginBottom: "15px" }}>🌐</div>

                {/*------- Title -----------*/}
                <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#222", marginBottom: "6px" }}>
                    Welcome back
                </h2>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                    Please enter your details to sign in
                </p>

                {/* --------Social buttons -------*/}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <button
                        style={{
                            flex: 1,
                            background: "#fff",
                            border: "1px solid #e2e2e2",
                            borderRadius: "12px",
                            padding: "12px",
                            fontSize: "18px",
                            cursor: "pointer",
                        }}
                    >
                        <FaGoogle />
                    </button>
                    <button
                        style={{
                            flex: 1,
                            background: "#fff",
                            border: "1px solid #e2e2e2",
                            borderRadius: "12px",
                            padding: "12px",
                            fontSize: "18px",
                            cursor: "pointer",
                        }}
                    >
                        <FaApple />
                    </button>
                    <button
                        style={{
                            flex: 1,
                            background: "#fff",
                            border: "1px solid #e2e2e2",
                            borderRadius: "12px",
                            padding: "12px",
                            fontSize: "18px",
                            cursor: "pointer",
                        }}
                    >
                        <FaFacebookF />
                    </button>
                </div>

                {/* -------Divider---------- */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        color: "#999",
                        fontSize: "14px",
                        margin: "15px 0",
                    }}
                >
                    <hr style={{ flex: 1, border: "none", borderBottom: "1px solid #e2e2e2" }} />
                    <span style={{ margin: "0 10px" }}>or</span>
                    <hr style={{ flex: 1, border: "none", borderBottom: "1px solid #e2e2e2" }} />
                </div>

                {/* --------Form ----------*/}
                <form onSubmit={handleSubmit}>
                    {/* -------Email--------- */}
                    <div style={{ textAlign: "left", marginBottom: "15px" }}>
                        <label
                            style={{ fontSize: "13px", fontFamily: "sans-serif", fontWeight: "bold", color: "#444", display: "block", marginBottom: "6px" }}
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

                    {/* -----Login button------ */}
                    <button
                        type="submit"
                        style={{
                            width: "50%",
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
                        Register
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Register;
