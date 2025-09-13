import React from "react";
import phone from "../assets/phone.png";
import video from "../assets/video.png";
import menu from "../assets/menu.png";

const Navbar = ({ selectedUser }) => {
    return (
        <div
            style={{
                width: "98%",
                padding: "16px",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "18px",
            }}
        >
            {selectedUser ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Profile circle */}
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
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
                        {selectedUser.username
                            ? selectedUser.username.charAt(0).toUpperCase()
                            : "?"}
                    </div>

                    {/* Username + online/offline status */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontFamily: 'Lato,sans-serif' }}>
                            {selectedUser.username}
                        </span>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "12px",
                                color: selectedUser.online ? "green" : "gray",
                            }}
                        >
                            <span style={{ fontSize: "12px", marginRight: "4px" }}>●</span>
                            <span>{selectedUser.online ? "Online" : "Offline"}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <span style={{ fontFamily: 'Lato,sans-serif' }}>
                    Select a user to chat
                </span>
            )}

            {/* Right-side icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                <img src={phone} alt="Call" style={{ width: "24px", height: "24px", cursor: "pointer" }} />
                <img src={video} alt="Video Call" style={{ width: "24px", height: "24px", cursor: "pointer" }} />
                <img src={menu} alt="More Options" style={{ width: "24px", height: "24px", cursor: "pointer" }} />
            </div>
        </div>
    );
};

export default Navbar;
