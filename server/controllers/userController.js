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
            firebaseUser: { uid: userRecord.uid, email, phone: phone || null },
            mongoUser: newUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { idToken } = req.body;

        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        res.json({
            message: "Login successful",
            user: decodedToken,
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
};


module.exports = { registerUser, loginUser };










