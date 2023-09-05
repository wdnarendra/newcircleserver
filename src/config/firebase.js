
let admin = require("firebase-admin");

let serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin.auth()
module.exports.fcm = admin.messaging()