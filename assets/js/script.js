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
  get,
  child,
  onChildRemoved,
  onChildAdded,
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
const dbRef = ref(getDatabase());

// Initialize Authentication
const auth = getAuth(app);
let currentUser = null;

// Check login Status
const buttonLogin = document.querySelector("[button-login]");
const buttonRegister = document.querySelector("[button-login]");
const buttonLogout = document.querySelector("[button-logout]");
const chat = document.querySelector("[chat]");
const chatRef = ref(db, "chats");

onAuthStateChanged(auth, (user) => {
  if (user) {
    buttonLogout.style.display = "inline-block";
    chat.style.display = "block";
    currentUser = user;
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

// Chat form
const formChat = document.querySelector("[chat]");
if (formChat) {
  formChat.addEventListener("submit", (event) => {
    event.preventDefault();

    const content = formChat.content.value;
    const uid = auth.currentUser.uid;
    if (content && uid) {
      set(push(ref(db, "chats")), {
        content: content,
        uid: uid,
      });

      formChat.content.value = "";
    }
    console.log(auth.currentUser.uid);
    console.log(content);
  });
}
// End Chat form

// Display default message
const chatBody = document.querySelector("[chat]");
if (chatBody) {
  onChildAdded(chatRef, (data) => {
    const key = data.key;
    const content = data.val().content;
    const userId = data.val().userId;

    get(child(dbRef, `users/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const fullName = snapshot.val().fullName;

          const newChat = document.createElement("div");
          newChat.setAttribute("chat-key", key);
          let htmlFullName = "";
          let htmlButtonDelete = "";

          if (userId == currentUser.uid) {
            newChat.classList.add("inner-outgoing");
            htmlButtonDelete = `
            <button class="button-delete" >
            <i class="fa-regular fa-trash-can"></i>
            </button>
            `;
          } else {
            newChat.classList.add("inner-incoming");
            htmlFullName = `
      <div class ="inner-name">
        ${fullName}
      </div>
      `;
          }

          newChat.innerHTMl = `
      <div class ="inner-name">
        ${htmlFullName}
      </div>
      <div class="inner-content">
        ${content}
      </div>
      
`;
          chatBody.appendChild(newChat);
          chatBody.scrollTop = chatBody.scrollHeight;

          // Delete message
          const buttonDelete = document.querySelector(".button-delete");
          if (buttonDelete) {
            buttonDelete.addEventListener("click", () => {
              remove(ref(db, "/chats/" + key));
            });
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    console.log(data.key);
    console.log(data.val());
  });
}
// End display default message

// delete realtime message
onChildRemoved(chatRef, (data) => {
  const key = data.key;
  const chatItem = chatBody.querySelector(`[chat-key="${key}"]`);
  if (chatItem) {
    chatItem.remove();
  }
});
