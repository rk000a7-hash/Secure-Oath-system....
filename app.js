import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCRjD_pZO6tS9UsNZ_xGRLuvSdNGRMUKn0",
  authDomain: "auth-system-3d7df.firebaseapp.com",
  projectId: "auth-system-3d7df",
  storageBucket: "auth-system-3d7df.firebasestorage.app",
  messagingSenderId: "240644110523",
  appId: "1:240644110523:web:6a7dab4cce8c1e6d87d19e",
  measurementId: "G-Z0432D1ZF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ---------------- GOOGLE LOGIN ----------------
window.googleLogin = async function () {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    sendTokenToBackend(token);
  } catch (error) {
    alert(error.message);
  }
};

// ---------------- PHONE OTP ----------------
window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "normal"
});

window.sendOTP = async function () {
  const phone = document.getElementById("phone").value;

  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );
    window.confirmationResult = confirmationResult;
    alert("OTP Sent!");
  } catch (error) {
    alert(error.message);
  }
};

window.verifyOTP = async function () {
  const code = document.getElementById("otp").value;

  try {
    const result = await window.confirmationResult.confirm(code);
    const token = await result.user.getIdToken();
    sendTokenToBackend(token);
  } catch (error) {
    alert("Invalid OTP");
  }
};

// ---------------- SEND TOKEN TO BACKEND ----------------
async function sendTokenToBackend(token) {
  const response = await fetch("http://localhost:3000/api/auth/verify-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token })
  });

  const data = await response.json();
  document.getElementById("msg").innerText =
    data.message || data.error;
}