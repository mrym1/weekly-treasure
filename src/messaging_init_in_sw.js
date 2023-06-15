import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCgZoFIbXJS_2hlqRv3lp0J_IFPEuEwmXI",
    authDomain: "tycoo-7cea7.firebaseapp.com",
    projectId: "tycoo-7cea7",
    storageBucket: "tycoo-7cea7.appspot.com",
    messagingSenderId: "1028013446832",
    appId: "1:1028013446832:web:cb035d0b4c28cb0c994d75",
};

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const app = initializeApp(firebaseConfig);

      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          "BExbp_1KMt9nN_OYvpDxzwzRtaOhfj8Hyxo0fsYXQ3wy2onIBeXZL85fNSsc54oHsGebttq0-hGoVqB1SzsPdnE",
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);
          
        } else {
          console.log("Can not get token");
        }
      });
    } else {
      console.log("Do not have permission!");
    }
  });
 
}

requestPermission();


  