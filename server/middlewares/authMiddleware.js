// middleware/auth.js
const admin = require("../config/firebase"); // Firebase admin instance

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const idToken = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(idToken);

        req.user = {
            uid: decoded.uid,
            email: decoded.email,
        };

        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = verifyToken;












