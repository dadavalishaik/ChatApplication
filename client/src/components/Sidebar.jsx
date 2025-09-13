import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../components/socket";
import chatImg from "../assets/chat.png"
import searchBar from "../assets/search.png"
import Switch from "../assets/switch.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = ({ user, users, selectedUser, setSelectedUser, handleLogout, error }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [unreadCounts, setUnreadCounts] = useState({});

    // Fetch unread counts on mount and when user changes
    useEffect(() => {
        if (!user) return;

        const fetchUnread = async () => {
            try {
                const res = await axios.get("http://localhost:5000/messages/unread", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("idToken")}` },
                });
                const counts = {};
                res.data.perConversation.forEach((c) => {
                    counts[c._id] = c.count;
                });
                setUnreadCounts(counts);
            } catch (err) {
                console.error("Failed to fetch unread counts:", err);
            }
        };

        fetchUnread();

        // Listen for real-time unread updates
        socket.on("receive_message", (msg) => {
            const conversationId = [user.uid, msg.from === user.uid ? msg.to : msg.from].sort().join("_");

            setUnreadCounts((prev) => ({
                ...prev,
                [conversationId]: prev[conversationId] ? prev[conversationId] + 1 : 1,
            }));
        });

        socket.on("message_read_receipt", ({ messageId, conversationId }) => {
            setUnreadCounts((prev) => ({
                ...prev,
                [conversationId]: 0,
            }));
        });

        return () => {
            socket.off("receive_message");
            socket.off("message_read_receipt");
        };
    }, [user]);

    // Filter users based on search term
    const filteredUsers = (users || []).filter(
        (u) => u?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            style={{
                width: "300px",
                borderRight: "1px solid #e0e0e0",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                height: "93vh",
            }}
        >
            <ToastContainer />

            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <img src={chatImg} alt="chat icon" style={{ width: "70px", height: "70px" }} />
                <span style={{ marginTop: "8%", fontFamily: "Lato, sans-serif", fontSize: "25px", fontWeight: "bold", color: "#444" }}>
                    Chat With Us
                </span>
            </div>
            {/* Logged-in user display */}
            <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}>
                {user ? user.username : "Loading..."}
            </div>

            {/* Search bar */}
            <div style={{ position: "relative", marginBottom: "12px", width: "90%" }}>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "12px 12px 12px  40px",
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        outline: "none",
                        fontSize: "14px",
                        width: "88%",
                        fontFamily: 'Lato,sans-serif',
                    }}
                />
                <span
                    style={{
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#888",
                        marginLeft: "3%",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    <img src={searchBar} style={{ width: "30px", height: "30px" }} alt="Search Icon" />
                </span>
            </div>

            {/* User list container with flex-grow to take available space */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                {/* Show error or user list */}
                {error ? (
                    <div style={{ color: "red" }}>{error}</div>
                ) : filteredUsers && filteredUsers.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, overflowY: "auto", flex: 1 }}>
                        {filteredUsers.map((u) => {
                            const conversationId = user && [user.uid, u._id].sort().join("_");
                            const unread = unreadCounts[conversationId] || 0;

                            return (
                                <li
                                    key={u._id}
                                    onClick={() => setSelectedUser(u)}
                                    style={{
                                        padding: "15px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        borderRadius: "200px",
                                        backgroundColor: selectedUser?._id === u._id ? "#e6f7ff" : "transparent",
                                        transition: "background-color 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f8ff")}
                                    onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        selectedUser?._id === u._id ? "#e6f7ff" : "transparent")
                                    }
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {/* Profile circle */}
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: "#007bff",
                                                background: "linear-gradient(45deg, #ff85c1, #a566f9, #5aa8f3)",
                                                color: "#fff",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                                marginRight: "12px",
                                                fontFamily: 'Lato,sans-serif',
                                            }}
                                        >
                                            {u.username ? u.username.charAt(0).toUpperCase() : "?"}
                                        </div>

                                        {/* Username and status */}
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontSize: "16px", fontWeight: "500", color: "#222" }}>
                                                {u.username || "Unknown"}
                                            </span>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    fontSize: "12px",
                                                    color: u.online ? "green" : "gray",
                                                }}
                                            >
                                                <span style={{ fontSize: "12px", marginRight: "4px" }}>●</span>
                                                <span>{u.online ? "online" : "offline"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Unread badge */}
                                    {unread > 0 && (
                                        <span
                                            style={{
                                                backgroundColor: "#f44336",
                                                color: "#fff",
                                                borderRadius: "12px",
                                                padding: "2px 8px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {unread}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div style={{ fontFamily: 'Lato,sans-serif' }}>No users found</div>
                )}
            </div>

            {/* Logout button - fixed at bottom */}
            <div
                onClick={() => {
                    toast.info(
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <p style={{ display: "flex", alignItems: "center", gap: "4px", margin: 0 }}>
                                <span style={{ color: "#f44336", fontWeight: "bold" }}>❗</span>
                                <span>Are you sure you want to logout?</span>
                            </p>
                            <div style={{ marginTop: "8px" }}>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toast.dismiss();
                                    }}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#f44336",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        marginRight: "8px"
                                    }}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => toast.dismiss()}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#ccc",
                                        color: "#000",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>,
                        {
                            position: "top-center",
                            autoClose: 5000,
                            closeOnClick: false,
                            closeButton: false,
                            draggable: false,
                            icon: false
                        }
                    );
                }}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    marginTop: "12px",
                    flexShrink: 0,
                }}
            >
                <img src={Switch} alt="Call" style={{ width: "40px", height: "40px" }} />
            </div>


            {/* Toast container */}
            <ToastContainer />

        </div>
    );
};

export default Sidebar;