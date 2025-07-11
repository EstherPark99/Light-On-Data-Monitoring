// Firebase 설정 파일
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyA9QP0zadCX18hACGpSjp1EudN_WtH0IlI",
    authDomain: "nodemcu-july.firebaseapp.com",
    databaseURL: "https://nodemcu-july-default-rtdb.firebaseio.com",
    projectId: "nodemcu-july",
    storageBucket: "nodemcu-july.firebasestorage.app",
    messagingSenderId: "314594208887",
    appId: "1:314594208887:web:b14fd274f0cb60bf5d2a72",
    measurementId: "G-ZCGFXXW4H8"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// 전역으로 내보내기
window.firebaseApp = app;
window.firebaseDatabase = database;
window.firebaseAnalytics = analytics;

console.log("Firebase 설정 완료");