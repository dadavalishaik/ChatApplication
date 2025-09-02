const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatapp-49465.firebaseio.com",
});

module.exports = admin;
