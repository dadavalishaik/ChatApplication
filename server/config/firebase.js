const admin = require("firebase-admin");
const serviceAccount = require("C:/Users/Hp/Downloads/chatapp-49465-firebase-adminsdk-fbsvc-f2dc0115ba.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatapp-49465.firebaseio.com",
});

module.exports = admin;
