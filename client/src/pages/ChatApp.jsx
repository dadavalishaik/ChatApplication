import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { auth } from "../components/firebase";
import { socket, connectSocket, disconnectSocket } from "../components/socket";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const ChatApp = () => {
  const [user, setUser] = useState(null); // logged-in user
  const [selectedUser, setSelectedUser] = useState(null); // chat partner
  const [messages, setMessages] = useState([]); // conversation messages
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const chatBodyRef = useRef(null);
  const navigate = useNavigate();
  const [messagesMap, setMessagesMap] = useState({});

  // ✅ Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("idToken");
        if (!token) {
          setError("No token found. Please login first.");
          return;
        }

        const res = await axios.get("http://localhost:5000/loggedinuser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        console.log("Logged-in user:", res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching user");
      }
    };

    fetchUser();
  }, []);

  const getConversationId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  //helper function
   const getUserId = (userObj) => {
    return userObj?.uid || userObj?._id || userObj?.id;
  };

  
  // ✅ Connect socket after user is set
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("idToken");
    connectSocket(token);

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("authenticated", (data) =>
      console.log("Socket authenticated:", data.uid)
    );
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("unauthorized", () => console.warn("Socket unauthorized"));

    // receive new messages
    socket.on("receive_message", (msg) => {
      const currentUserId = getUserId(user);
      const otherUserId = msg.from === currentUserId ? msg.to : msg.from;
      const conversationId = getConversationId(currentUserId, otherUserId);

      setMessagesMap(prev => {
        const convMsgs = prev[conversationId] || [];
        return { ...prev, [conversationId]: [...convMsgs, msg] };
      });

      // Update chat view if conversation is open
      if (selectedUser) {
        const selectedUserId = getUserId(selectedUser);
        const currentConvId = getConversationId(currentUserId, selectedUserId);
        
        if (conversationId === currentConvId) {
          setMessages(prev => [...prev, msg]);

          // mark as read
          axios.put(`http://localhost:5000/messages/${conversationId}/read`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("idToken")}` }
          }).catch(console.error);
        }
      }
    });

    // ✅ Delivered status listener
    socket.on("message_status", ({ messageId, delivered }) => {
      if (delivered) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId ? { ...m, delivered: true } : m
          )
        );
      }
    });

    // ✅ Read receipt listener
    socket.on("message_read_receipt", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, read: true } : m
        )
      );
    });

    // user online/offline status
    socket.on("user_status", ({ uid, online }) => {
      setUsers((prev) =>
        prev.map((u) => (getUserId(u) === uid ? { ...u, online } : u))
      );
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_status");
      socket.off("message_read_receipt");
      socket.off("user_status");
    };
  }, [user, selectedUser]);



  // ✅ Fetch users except logged-in user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.warn("No logged-in user yet");
          return;
        }

        const token = await currentUser.getIdToken();
        const res = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = res.data.users || [];
        const filtered = allUsers.filter(
          (u) => u?.email && u.email !== currentUser.email
        );

        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Fetch recent messages when chat partner is selected
  useEffect(() => {
    if (!selectedUser || !user) return;


    // Use uid for consistency, fall back to _id if uid doesn't exist
    const selectedUserId = selectedUser.uid || selectedUser._id;

    // Temporary conversation ID
    const tempConvid = getConversationId(user.uid, selectedUserId);
    console.log("tempConvid:", tempConvid);
    console.log("user.uid:", user.uid);
    console.log("selectedUserId:", selectedUserId);


    // Load messages from map if exist
    if (messagesMap[tempConvid]) {
      setMessages(messagesMap[tempConvid]);
    } else {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("idToken");

          // Only fetch if conversation exists in DB
          const res = await axios.get(
            `http://localhost:5000/messages/${tempConvid}/recent`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setMessages(res.data);

          // Save to map
          setMessagesMap(prev => ({ ...prev, [tempConvid]: res.data }));

          // mark as read
          await axios.put(
            `http://localhost:5000/messages/${tempConvid}/read`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error(err);
        }
      };

      fetchMessages();
    }
  }, [selectedUser, user, messagesMap]);


  // ✅ Scroll to bottom on new messages
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // ✅ Send new message
  const handleSendMessage = () => {
    if (!input.trim() || !selectedUser || !socket) return;

    // Use uid for consistency, fall back to _id if uid doesn't exist
    const selectedUserId = selectedUser.uid || selectedUser._id;
    // Temporary conversation ID
    const tempConvid = getConversationId(user.uid, selectedUserId);

    // Payload to send
    const payload = {
      text: input,
      to: selectedUserId,
      from: user.uid,
      conversationId: tempConvid,
      createdAt: new Date().toISOString(),
    };

    // Emit via socket
    socket.emit("send_message", payload);

    // Update frontend UI immediately
    setMessages((prev) => [...prev, payload]);
    setMessagesMap((prev) => {
      const convMsgs = prev[tempConvid] || [];
      return { ...prev, [tempConvid]: [...convMsgs, payload] };
    });

    setInput(""); // clear input
  };

  const handleLogout = () => {
    disconnectSocket();
    console.log("log out");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }

  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Sidebar
        user={user}
        users={users}
        selectedUser={selectedUser}
        setUsers={setUsers}
        handleLogout={handleLogout}
        setSelectedUser={setSelectedUser}
        error={error}
      />

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f0f2f5",
        }}
      >
        {/* Navbar */}
        <div
          style={{
            width: "98%",
            padding: "16px",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {selectedUser ? (
            <>
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
                {selectedUser.username ? selectedUser.username.charAt(0).toUpperCase() : "?"}
              </div>

              {/* Username */}
              <span>{selectedUser.username}</span>
            </>
          ) : (
            <span>Select a user to chat</span>
          )}
        </div>

        {/* Chat Body */}
        <div
          ref={chatBodyRef}
          style={{ flex: 1, overflowY: "auto", padding: "16px" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.from === user?.uid ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  backgroundColor:
                    msg.from === user?.uid ? "#007bff" : "#fff",
                  color: msg.from === user?.uid ? "#fff" : "#000",
                  padding: "12px",
                  borderRadius: "16px",
                  maxWidth: "60%",
                  wordWrap: "break-word",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div>{msg.text}</div>
                <div
                  style={{
                    fontSize: "10px",
                    textAlign: "right",
                    marginTop: "4px",
                    color: "#888",
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString()}
                  {msg.from === user?.uid && (
                    <span style={{ marginLeft: "6px" }}>
                      {msg.read
                        ? "✔✔" // read
                        : msg.delivered
                          ? "✔" // delivered
                          : "…"}{" "}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Send message */}
        {selectedUser && (
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#fff",
              display: "flex",
            }}
          >
            <input
              type="text"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "24px",
                border: "1px solid #ccc",
                fontSize: "16px",
                outline: "none",
                marginRight: "8px",
              }}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: "12px 24px",
                borderRadius: "24px",
                border: "none",
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;










