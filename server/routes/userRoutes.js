const express = require("express");
const { registerUser, loginUser, getLoggedinUser, getAllUsers } = require("../controllers/userController");
const verifyFirebaseToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Register Route
router.post("/register", registerUser);

router.post("/login", loginUser);

//GET logged-in user
router.get("/loggedinuser", verifyFirebaseToken, getLoggedinUser)

//GET ALL users
router.get("/users", verifyFirebaseToken, getAllUsers)

module.exports = router;
