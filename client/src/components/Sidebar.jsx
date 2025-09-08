import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../components/socket"; // your socket instance

const Sidebar = ({ user, users, selectedUser, setSelectedUser, handleLogout, error }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [unreadCounts, setUnreadCounts] = useState({}); // { conversationId: count }

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
                height: "90vh",
            }}
        >
            {/* Logged-in user display */}
            <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}>
                {user ? user.username : "Loading..."}
            </div>

            {/* Search bar */}
            <div style={{ position: "relative", marginBottom: "12px", width: "100%" }}>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "8px 12px 8px 32px", // left padding for icon
                        borderRadius: "12px",
                        border: "1px solid #ccc",
                        outline: "none",
                        fontSize: "14px",
                        width: "88%",
                    }}
                />
                <span
                    style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#888",
                        fontSize: "14px",
                    }}
                >
                    🔍
                </span>
            </div>

            {/* Show error or user list */}
            {error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : filteredUsers && filteredUsers.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, overflowY: "auto", flex: 1 }}>
                    {filteredUsers.map((u) => {
                        // const conversationId = [user.uid, u._id].sort().join("_");
                        // const conversationId = user ? [user.uid, u._id].sort().join("_") : "";
                        const conversationId = user && [user.uid, u._id].sort().join("_");
                        const unread = unreadCounts[conversationId] || 0;

                        return (
                            <li
                                key={u._id}
                                onClick={() => setSelectedUser(u)}
                                style={{
                                    padding: "8px",
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
                                            color: "#fff",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            marginRight: "12px",
                                        }}
                                    >
                                        {u.username ? u.username.charAt(0).toUpperCase() : "?"}
                                    </div>

                                    {/* Username and status */}
                                    <div style={{ display: "flex", flexDirection: "column" }}>
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
                <div>No users found</div>
            )}

            {/* Logout button */}
            <button
                onClick={handleLogout}
                style={{
                    padding: "10px",
                    marginTop: "auto",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Sidebar;









