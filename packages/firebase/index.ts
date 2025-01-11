import { initializeApp } from "firebase/app";
export * from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDifOG_QWh0Rc3kFjclYGKCsnx4TjfNLtI",
  authDomain: "neo-v1-52d2b.firebaseapp.com",
  projectId: "neo-v1-52d2b",
  storageBucket: "neo-v1-52d2b.appspot.com",
  messagingSenderId: "871516198043",
  appId: "1:871516198043:web:d290ff94b1b309f631e23e",
  measurementId: "G-XZFRG8S5FK"
};

export const app = initializeApp(firebaseConfig);

