import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDd8ykwhehPho32DQZcIQIag5fUZePRPuQ",
    authDomain: "gameartificial-intelligence.firebaseapp.com",
    projectId: "gameartificial-intelligence",
    storageBucket: "gameartificial-intelligence.firebasestorage.app",
    messagingSenderId: "605391258890",
    appId: "1:605391258890:web:ab600115dcf0aef38de6f3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
