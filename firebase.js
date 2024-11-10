import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA1-GTIs2CImRdn0huWbmRTv7Lnox4WlTU",
    authDomain: "recipie-hub-4a3dd.firebaseapp.com",
    projectId: "recipie-hub-4a3dd",
    storageBucket: "recipie-hub-4a3dd.firebasestorage.app",
    messagingSenderId: "432554868432",
    appId: "1:432554868432:web:ce46ecc140240510a768d5",
    measurementId: "G-RR1NV0R588"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Handle login
const handleLogin = (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Successfully logged in
        console.log("User logged in:", userCredential.user);

        // Get the user's name (or email if displayName is not available) and display it
        const userName = userCredential.user.displayName || userCredential.user.email;

        localStorage.setItem('userName', userName);

        const userElement = document.getElementById("user");
        if (userElement) {
            userElement.innerHTML = `Hello, ${userName}! <a href="#" id="logout">Logout</a>`;
        }

        // Redirect to dashboard or another page
        window.location.href = "/index.html";
    })
    .catch((error) => {
        const errorMessage = error.message;
        document.getElementById("error-message").textContent = errorMessage;
    });
};

// Handle sign up
const handleSignup = (event) => {
    event.preventDefault();

    // Get the name, email, and password values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successfully signed up
            console.log("User signed up:", userCredential.user);

            // Update the user's profile with their name
            updateProfile(userCredential.user, {
                displayName: name
            }).then(() => {
                console.log("User name updated successfully!");
                window.location.href = "/login.html";
            }).catch((error) => {
                console.error("Error updating user name:", error.message);
            });
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById("error-message").textContent = errorMessage;
        });
};

// Handle logout
const handleLogout = (event) => {
    event.preventDefault();

    const userElement = document.getElementById("user");

    // Sign out the user from Firebase
    signOut(auth).then(() => {
        localStorage.removeItem('userName');
        
        // Update the DOM to show login/signup links again
        if (userElement) {
            userElement.innerHTML = `
                <a href="/login.html">Login</a> |
                <a href="/signup.html">Sign Up</a>
            `;
        }

        // Redirect to login page or home page
        window.location.href = "/login.html";
    }).catch((error) => {
        console.error("Error signing out:", error.message);
    });
};

// Wait for DOM to load before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
    }

    // Check if the user is logged in and show the appropriate UI
    const userName = localStorage.getItem('userName');
    const userElement = document.getElementById("user");

    if (userName) {
        if (userElement) {
            userElement.innerHTML = `Hello, ${userName}! <a href="#" id="logout">Logout</a>`;
        }

        const logoutLink = document.getElementById("logout");
        if (logoutLink) {
            logoutLink.addEventListener("click", handleLogout);
        }
    } else {
        if (userElement) {
            userElement.innerHTML = `
                <a href="/login.html">Login</a> |
                <a href="/signup.html">Sign Up</a>
            `;
        }
    }
});
