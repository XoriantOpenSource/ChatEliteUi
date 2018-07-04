//https://github.com/firebase/quickstart-js/issues/102
self.addEventListener("notificationclick", (event) => {
    event.waitUntil(async function () {
        const allClients = await clients.matchAll({
            includeUncontrolled: true
        });

        let chatClient;

        for (const client of allClients) {
            if (client.url == event.notification.data.FCM_MSG.notification.click_action) {
                client.focus();
                chatClient = client;
                break;
            }
        }

        if (!chatClient) {
            chatClient = await clients.openWindow(event.notification.data.FCM_MSG.notification.click_action);
        }
    }());
});

importScripts("https://www.gstatic.com/firebasejs/4.7.0/firebase.js")
importScripts("https://www.gstatic.com/firebasejs/4.7.0/firebase-messaging.js")

// Initialize Firebase
firebase.initializeApp({
    'messagingSenderId': '874844091567'
});
const messaging = firebase.messaging();

self.addEventListener('notificationclose', function (event) {
    self.registration.getNotifications().then(function (notifications) {
        notifications.forEach(function (notification) {
            notification.close()
        })
    });
})