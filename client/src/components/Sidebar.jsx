import React from "react";

const Sidebar = ({ user, users, selectedUser, setSelectedUser, handleLogout, error }) => {
    return (
        <div
            style={{
                width: "300px",
                borderRight: "1px solid #e0e0e0",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
            }}
        >
            <div
                style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "16px",
                }}
            >
                {user ? user.email : "Loading..."}
            </div>

            {error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : users.length === 0 ? (
                <div>No users loaded yet</div>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {users.map((u) => (
                        <li
                            key={u._id}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #f0f0f0",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: selectedUser?._id === u._id ? "#e6f7ff" : "transparent",
                            }}
                            onClick={() => setSelectedUser(u)}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <span>{u.email}</span>
                                <span
                                    style={{
                                        fontSize: "20px",
                                        color: u.online ? "green" : "gray",
                                        marginLeft: "4px",
                                        marginBottom: '8px'
                                    }}
                                >
                                    ●
                                </span>
                            </div>
                            <div style={{ fontSize: "15px", color: u.online ? "green" : "gray", marginLeft: "20px" }}>
                                {u.online ? "online" : "offline"}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button
                onClick={handleLogout}
                style={{
                    padding: "10px",
                    marginTop: "auto", // pushes the button to the bottom
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
