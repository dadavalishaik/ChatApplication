import React, { useState } from "react";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import axios from "axios";
import chatImg from "../assets/chat.png"
import google from "../assets/google.png"
import instagram from "../assets/instagram.png"
import facebook from "../assets/facebook.png"

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/register", {
                email,
                username,
                password,

            });

            setMessage("Registration successful!");
            console.log(response.data);


        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
            setEmail("");
            setUsername("");
            setPassword("");
        }
        // ✅ Clear the form fields after submission

    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                {/* --------Logo ----------*/}
                <img src={chatImg} alt="chat icon" style={{ width: "90px", height: "90px" }} />

                {/*------- Title -----------*/}
                <h2 style={{ fontFamily: 'Lato,sans-serif', fontSize: "22px", fontWeight: "bold", color: "#222", marginBottom: "6px" }}>
                    Sign in here
                </h2>
                <p style={{ fontFamily: 'Lato,sans-serif', fontSize: "14px", color: "#666", marginBottom: "20px" }}>
                    Please enter your details to Register
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
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <img src={google} alt="Google" style={{ width: "20px", height: "20px" }} />
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
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <img src={instagram} alt="instagram" style={{ width: "20px", height: "20px" }} />
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
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <img src={facebook} alt="instagram" style={{ width: "20px", height: "20px" }} />
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
                    <span style={{ margin: "0 10px", fontFamily: 'Lato,sans-serif' }}>or</span>
                    <hr style={{ flex: 1, border: "none", borderBottom: "1px solid #e2e2e2" }} />
                </div>

                {/* --------Form ----------*/}
                <form onSubmit={handleSubmit}>
                    {/* -------Email--------- */}
                    <div style={{ position: "relative", width: "90%", marginBottom: "20px", marginLeft: "15px" }}>
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
                            Email
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
                                fontFamily: 'Lato,sans-serif',
                                outline: "none",
                            }}
                        />
                    </div>

                    <div style={{ position: "relative", width: "90%", marginBottom: "20px", marginLeft: "15px" }}>
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
                            Username
                        </label>
                        <input
                            type="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
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
                    </div>

                    {/*--------- Password------- */}
                    <div style={{ position: "relative", width: "90%", marginBottom: "20px", marginLeft: "15px" }}>
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

                    </div>

                    {/* -----Login button------ */}
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
                        Register
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Register;
