import React, { useState } from "react";

// Dummy data for users and messages
const users = [
  { name: "Harry Maguire", time: "09:12 AM", message: "You need to improve now", online: true },
  { name: "United Family", time: "06:25 AM", message: "Rashford is typing...", online: true, typing: true },
  { name: "Ramsus Højlund", time: "03:11 AM", message: "Bos, I need to talk today", online: false, unread: 2 },
  { name: "Andre Onana", time: "11:34 AM", message: "I need more time bos 😔", online: true },
  { name: "Reguilon", time: "09:12 AM", message: "", online: true },
];

const messages = [
  { sender: "Harry Maguire", time: "08:34 AM", text: "Hey lads, tough game yesterday. Let's talk about what went wrong and how we can improve 😊" },
  { sender: "Bruno Fernandes", time: "08:34 AM", text: "Agreed, Harry 👍. We had some good moments, but we need to be more clinical in front of the goal 😢" },
  { sender: "You", time: "08:34 AM", text: "We need to control the midfield and exploit their defensive weaknesses. Bruno and Paul, I'm counting on your creativity. Marcus and Jadon, stretch their defense wide. Use your pace and take on their full-backs." },
];

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(users[1]);
  const [input, setInput] = useState("");

  return (
    <div style={{
      display: "flex",
      height: "90vh",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f8f9fa"
    }}>
      {/* Sidebar */}
      <div style={{
        width: "300px",
        borderRight: "1px solid #e0e0e0",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}>Erik Ten Hag</div>
        <div style={{ display: "flex", marginBottom: "16px" }}>
          {["All", "Personal", "Groups"].map(tab => (
            <div key={tab} style={{
              flex: 1,
              textAlign: "center",
              padding: "8px",
              borderBottom: selectedUser.name === tab ? "2px solid #007bff" : "2px solid transparent",
              cursor: "pointer",
              color: "#333",
              fontWeight: "bold"
            }}>
              {tab}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {users.map(user => (
            <div key={user.name} onClick={() => setSelectedUser(user)} style={{
              display: "flex",
              flexDirection: "column",
              padding: "8px",
              marginBottom: "8px",
              cursor: "pointer",
              backgroundColor: selectedUser.name === user.name ? "#e6f7ff" : "transparent",
              borderRadius: "8px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                {user.name}
                <span style={{ fontSize: "12px", color: "#888" }}>{user.time}</span>
              </div>
              <div style={{ fontSize: "14px", color: user.typing ? "green" : "#555" }}>
                {user.message} {user.unread && <span style={{
                  backgroundColor: "red",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  marginLeft: "8px",
                  fontSize: "12px"
                }}>{user.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f0f2f5" }}>
        {/* Navbar */}
        <div style={{
          width: "100%",
          padding: "16px",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          fontWeight: "bold",
          fontSize: "18px"
        }}>
          {selectedUser.name}
          {selectedUser.typing && <span style={{ fontSize: "12px", color: "green", marginLeft: "8px" }}>is typing...</span>}
        </div>
        {/* Chat Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: msg.sender === "You" ? "flex-end" : "flex-start",
              marginBottom: "12px"
            }}>
              <div style={{
                backgroundColor: msg.sender === "You" ? "#007bff" : "#fff",
                color: msg.sender === "You" ? "#fff" : "#000",
                padding: "12px",
                borderRadius: "16px",
                maxWidth: "60%",
                wordWrap: "break-word",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.1)"
              }}>
                <div style={{ fontSize: "12px", marginBottom: "4px", fontWeight: "bold" }}>{msg.sender}</div>
                <div>{msg.text}</div>
                <div style={{ fontSize: "10px", textAlign: "right", marginTop: "4px", color: "#888" }}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Search bar / Send message */}
        <div style={{
          padding: "16px",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          display: "flex"
        }}>
          <input
            type="text"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "24px",
              border: "1px solid #ccc",
              fontSize: "16px",
              outline: "none",
              marginRight: "8px"
            }}
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button style={{
            padding: "12px 24px",
            borderRadius: "24px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
