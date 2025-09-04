// middlewares/authMiddleware.js
const admin = require("../config/firebase"); // your firebase admin SDK init

async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded; // contains uid, email, etc.
        next();
    } catch (err) {
        console.error("Firebase Auth error:", err);
        return res.status(401).json({ message: "Unauthorized", error: err.message });
    }
}

module.exports = verifyFirebaseToken;
