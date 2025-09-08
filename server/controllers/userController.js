const User = require("../models/userModel");
const admin = require("../config/firebase");
const { getSocketIdForUser } = require("../config/redisClient");
const db = admin.firestore();

const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // creating Firebase Auth user
        const userRecord = await admin.auth().createUser({
            email,
            username,
            password
        });

        //db connection
        await db.collection("users").doc(userRecord.uid).set({
            email,
            username,
            createdAt: new Date(),
        });

        const newUser = new User({
            firebaseUid: userRecord.uid,
            email,
            username,
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            firebaseUser: { uid: userRecord.uid, email },
            mongoUser: newUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // verify email/password via Firebase Auth REST API here:

        const axios = require("axios");
        const apiKey = "AIzaSyBMoQRyVckJNaU6MTXIBbSpn1quc7K3gC8";

        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );

        const firebaseUser = response.data;

        // Fetch user metadata from MongoDB
        const mongoUser = await User.findOne({ firebaseUid: firebaseUser.localId });

        res.status(200).json({
            message: "Login successful",
            firebaseUser: {
                uid: firebaseUser.localId,
                email: firebaseUser.email,
                idToken: firebaseUser.idToken, // token for authenticated requests
            },
            mongoUser,
        });
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Login failed",
            error: error.response?.data?.error?.message || error.message,
        });
    }
};

//for getting logged-in user
const getLoggedinUser = async (req, res) => {

    try {
        // get uid from decoded firebase token
        const firebaseUid = req.user.uid;
       
        // find user in MongoDB
        const mongoUser = await User.findOne({ firebaseUid });
        if (!mongoUser) {
            return res.status(404).json({ message: "User not found in MongoDB" });
        }

        res.status(200).json({
            message: "Current user fetched successfully",
            firebaseUser: req.user, // uid, email, etc
            username:req.username,
            mongoUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch current user",
            error: error.message,
        });
    }

}

//get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        // get all online users from Redis
        const onlineUsers = [];
        for (const u of users) {
            const socketId = await getSocketIdForUser(u._id.toString());
            if (socketId) onlineUsers.push(u._id.toString());
        }

        // map users with online status
        const usersWithStatus = users.map(u => ({
            ...u.toObject(),
            online: onlineUsers.includes(u._id.toString()),
        }));

        res.status(200).json({
            message: "Users fetched successfully",
            users: usersWithStatus,
        });
    } catch (error) {
        console.error("❌ Error in getAllUsers:", error.message);
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};


module.exports = { registerUser, loginUser, getLoggedinUser, getAllUsers };










