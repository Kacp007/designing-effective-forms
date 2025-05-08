import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
 
const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");
const nameInput = document.querySelector("#firstName");
const lastNameInput = document.querySelector("#lastName");
const emailInput = document.querySelector("#email");

const firebaseConfig = {
  apiKey: "AIzaSyD29Ji1JWu8fltB0LexBl3K4aMVHIz51Yc",
  authDomain: "tpf-lab3-70da3.firebaseapp.com",
  projectId: "tpf-lab3-70da3",
  storageBucket: "tpf-lab3-70da3.appspot.com",
  messagingSenderId: "481270494460",
  appId: "1:481270494460:web:f9e112b62e0c8b97599379"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const userSignIn = async () => {
    signInWithPopup(auth, provider).then((result) => {
        
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
 }

const userSignOut = async () => {
    signOut(auth).then(() => {
        alert("You have been signed out!")
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("You are authenticated with Google");
        
        const [firstName, lastName] = user.displayName.split(" ");
        nameInput.value = firstName;
        lastNameInput.value = lastName;
        emailInput.value = user.email;

    }
})
 
signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);