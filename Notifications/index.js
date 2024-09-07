var admin = require("firebase-admin");
const { applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const express = require("express");
const { json } = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use( cors({
    origin:"*",
}));
app.use( cors({
    methods : ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
}))
app.use(function (req, res, next) {
    res.header("Content-type", "application/json");
    next();
})
app.listen(8085, function () {
    console.log("server started on port 8085");
});

app.post("/api/notification/send", function (req, res) {
    const message = {
        notification: req.body.notificationMessage,
        token: "dHRUuf-ZFd1OprQN5Lx9j4:APA91bFl1nNKskooKJLIZ6qvi3MJVzYJULIFu1j0f_vigt6mvXLd4s7UF-rOHDHgn3izmGiB5v7vqLVJek8hXlN_o6N4omuKwF_NjxiPak-CM9DtEm_Gx7siSDT4X6vA3CSqnwFvTZI7"
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    getMessaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            res.status(200).json({
                message: "successfully sent message",
            });
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            res.status(400);
            res.send(error);
            console.log('Error sending message:', error);
        });
})



process.env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: "subsync-01",
});
const db = admin.firestore();

