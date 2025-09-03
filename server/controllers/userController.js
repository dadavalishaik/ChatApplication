const User = require("../models/userModel");
const admin = require("../config/firebase");
const db = admin.firestore();

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // creating Firebase Auth user
        const userRecord = await admin.auth().createUser({
            email,
            password,

        });

        //db connection
        await db.collection("users").doc(userRecord.uid).set({
            email,
            createdAt: new Date(),
        });

        const newUser = new User({
            firebaseUid: userRecord.uid,
            email,
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

        // Firebase doesn't allow direct login from admin SDK.
        // So you can use Firebase Client SDK on frontend for login,
        // or verify email/password via Firebase Auth REST API here:

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


module.exports = { registerUser, loginUser };










