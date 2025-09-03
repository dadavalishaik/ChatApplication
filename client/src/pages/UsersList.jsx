import React from "react";

const UsersList = () => {
  return (
    <div style={{ width: "360px", fontFamily: "Arial, sans-serif", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <img
          src="https://via.placeholder.com/40" // Replace with Erik Ten Hag's image
          alt="Erik Ten Hag"
          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "12px" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", fontSize: "16px", color: "#111" }}>Erik Ten Hag</div>
          <div style={{ fontSize: "12px", color: "#888" }}>Info account</div>
        </div>
        <div style={{ cursor: "pointer", color: "#888" }}>🔍</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        {["All", "Personal", "Groups"].map((tab) => (
          <div
            key={tab}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "8px 0",
              borderBottom: tab === "All" ? "2px solid #007bff" : "2px solid transparent",
              fontWeight: tab === "All" ? "bold" : "normal",
              color: tab === "All" ? "#007bff" : "#555",
              cursor: "pointer"
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Pinned Message */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>Pinned Message</div>
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f8f8f8", padding: "8px", borderRadius: "8px" }}>
          <img
            src="https://via.placeholder.com/32" // Replace with Harry Maguire's image
            alt="Harry Maguire"
            style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "12px" }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>Harry Maguire</div>
            <div style={{ fontSize: "13px", color: "#555", display: "flex", alignItems: "center" }}>
              You need to improve now <span style={{ marginLeft: "8px", color: "#007bff" }}>✔✔</span>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "#888", marginLeft: "8px" }}>09:12 AM</div>
        </div>
      </div>

      {/* Group */}
      <div style={{ marginBottom: "16px", backgroundColor: "#f0f0f0", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center" }}>
        <div style={{ fontSize: "16px", marginRight: "8px", color: "red" }}>😈</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>United Family 🪴</div>
          <div style={{ fontSize: "13px", color: "green" }}>Rashford is typing…</div>
        </div>
        <div style={{ fontSize: "11px", color: "#888" }}>06:25 AM</div>
      </div>

      {/* Individual Message */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
        <img
          src="https://via.placeholder.com/32" // Replace with Ramsus Højlund's image
          alt="Ramsus Højlund"
          style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "12px" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>Ramsus Højlund</div>
          <div style={{ fontSize: "13px", color: "#555", display: "flex", alignItems: "center" }}>
            Bos, I need to talk today
            <div style={{ backgroundColor: "red", color: "#fff", borderRadius: "50%", width: "18px", height: "18px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px", marginLeft: "8px" }}>
              2
            </div>
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "#888", marginLeft: "8px" }}>03:11 AM</div>
      </div>

      {/* Message */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="https://via.placeholder.com/32" // Replace with Andre Onana's image
          alt="Andre Onana"
          style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "12px" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", fontSize: "14px", color: "#111" }}>Andre Onana</div>
          <div style={{ fontSize: "13px", color: "#555" }}>I need more time bos 😔</div>
        </div>
        <div style={{ fontSize: "11px", color: "#888", marginLeft: "8px" }}>11:34 AM</div>
      </div>
    </div>
  );
};

export default UsersList;
