    importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
    importScripts(
    "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
    );

    const firebaseConfig = {
        apiKey: "AIzaSyDTJhPHB8ZtFQ3BswYh3lWSft28IrDOAJI",
        authDomain: "subsync-01.firebaseapp.com",
        projectId: "subsync-01",
        storageBucket: "subsync-01.appspot.com",
        messagingSenderId: "774920679039",
        appId: "1:774920679039:web:c0d5995270407beba6194a",
        measurementId: "G-6MG9Z4H21T"
    };

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
    });