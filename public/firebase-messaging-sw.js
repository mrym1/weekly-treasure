//  // Scripts for firebase and firebase messaging
//  importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
//  importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 
// // import { getMessaging, getToken } from "firebase/messaging";
// // import { onBackgroundMessage } from "firebase/messaging/sw";

//  // Initialize the Firebase app in the service worker by passing the generated config
//  const firebaseConfig = {
//   apiKey: "AIzaSyBhl4sxnPLo9wP9d84y21lmvfzVys7TobI",
//   authDomain: "weekly-treasure-4c3b5.firebaseapp.com",
//   projectId: "weekly-treasure-4c3b5",
//   storageBucket: "weekly-treasure-4c3b5.appspot.com",
//   messagingSenderId: "93289193618",
//   appId: "1:93289193618:web:ec9cd70a179b4d2806064b",
//   measurementId: "G-06HEVP68CJ"
// };

//  firebase.initializeApp(firebaseConfig);

//  // Retrieve firebase messaging
//  const messaging = firebase.messaging();

//  messaging.onBackgroundMessage(function(payload) {
//    console.log("Received background message ", payload);

//    const notificationTitle = payload.notification.title;
//    const notificationOptions = {
//      body: payload.notification.body,
//    };

//   //  self.registration.showNotification(notificationTitle, notificationOptions);
//  });
// //  const messaginges = getMessaging();
// // onBackgroundMessage(messaginges, (payload) => {
// //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
// //   // Customize notification here
// //   const notificationTitle = 'Background Message Title';
// //   const notificationOptions = {
// //     body: 'Background Message body.',
// //     icon: '/firebase-logo.png'
// //   };
// //   var self = this; 
// //   self.registration.showNotification(notificationTitle,
// //     notificationOptions);
// // });
