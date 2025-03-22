// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA_pIPwNsr49em3IDiVYAEbmIqEF6bMiI",
  authDomain: "chat-platform-5b0c7.firebaseapp.com",
  projectId: "chat-platform-5b0c7",
  storageBucket: "chat-platform-5b0c7.firebasestorage.app",
  messagingSenderId: "134907713229",
  appId: "1:134907713229:web:ccd2ae32d678db93583b84",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize database
const db = getDatabase();

// Initialize Authentication
const auth = getAuth(app);
console.log(auth);

// Check login Status
const buttonLogin = document.querySelector("[button-login]");
const buttonRegister = document.querySelector("[button-login]");
const buttonLogout = document.querySelector("[button-logout]");
const chat = document.querySelector("[chat]");
onAuthStateChanged(auth, (user) => {
  if (user) {
    buttonLogout.style.display = "inline-block";
    chat.style.display = "block";
  } else {
    buttonLogin.style.display = "inline-block";
    buttonRegister.style.display = "inline-block";
    if (chat) {
      chat.innerHTML = `<i>Please login to use this app.</i>`;
    }
  }
});

// End Check login Status

// Register
const formRegister = document.querySelector("#form-register");
if (formRegister) {
  formRegister.addEventListener("click", (event) => {
    event.preventDefault();
    const fullName = formRegister.fullName.value;
    const email = formRegister.email.value;
    const password = formRegister.password.value;
    if (fullName && email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          if (user) {
            set(ref(db, `users/${user.uid}`), {
              fullName: fullName,
            }).then(() => {
              window.location.href = "index.html";
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}
// End Register

// Login
const formLogin = document.querySelector("#form-login");
if (formLogin) {
  formLogin.addEventListener("click", (event) => {
    event.preventDefault();
    const email = formLogin.email.value;
    const password = formLogin.password.value;
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          if (user) {
            window.location.href = "index.html";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}
// End Login

// Log Out

if (buttonLogout) {
  buttonLogout.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
// End Log Out
