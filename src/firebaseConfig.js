import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDTQ9K3wlaZkvpTpaZreJTAi_BRoS_CNCw",
  authDomain: "i-lex-r-test-app1.firebaseapp.com",
  databaseURL: "https://i-lex-r-test-app1.firebaseio.com",
  projectId: "i-lex-r-test-app1",
  storageBucket: "i-lex-r-test-app1.appspot.com",
  messagingSenderId: "819846641165",
  appId: "1:819846641165:web:82b8d15de2f0f26059c744"
};
const authErrCodes = {
  "auth/invalid-email": "Указано не корректное значение email.",
  "auth/user-disabled": "Указанный email отключен.",
  "auth/user-not-found": "Пользователь с таким email не найден.",
  "auth/wrong-password": "Указанный неверный пароль."
};

const db = firebase.initializeApp(config).firestore();
const auth = firebase.auth();

const dbSettings = {};
db.settings(dbSettings);

export { db, auth, authErrCodes };
