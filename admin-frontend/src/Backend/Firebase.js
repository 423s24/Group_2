import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD0SfGl4KETc_rGBuiSCDbx9FZk5PzNsnQ",
    authDomain: "hrdc-maintanance-ticket-mngr.firebaseapp.com",
    projectId: "hrdc-maintanance-ticket-mngr",
    storageBucket: "hrdc-maintanance-ticket-mngr.appspot.com",
    messagingSenderId: "1044310518528",
    appId: "1:1044310518528:web:595654d00bec44efe421e5",
    measurementId: "G-EZJKT4ZZEF"
};
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }