// src/socket.js
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // backend URL

export const socket = io(SOCKET_URL, {
    autoConnect: false, // we will connect manually after login
    transports: ["websocket"],
});

// connect after user logs in
export const connectSocket = (idToken) => {
    socket.auth = { idToken }; // send Firebase token for auth
    socket.connect();
    socket.on("authenticated", () => {
        console.log("Socket auth complete, safe to send messages now");
    });
    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);

        socket.emit("authenticate", { idToken });
    });
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("unauthorized", () => console.warn("Socket unauthorized"));
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
        console.log("socket disconnected manually");
    }
}