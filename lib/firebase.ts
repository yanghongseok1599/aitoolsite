import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBpWQul3jcndSQbMo80Z2UXtx60dBQgem8",
  authDomain: "trainermileston-aitoolsite.firebaseapp.com",
  projectId: "trainermileston-aitoolsite",
  storageBucket: "trainermileston-aitoolsite.firebasestorage.app",
  messagingSenderId: "1050682690280",
  appId: "1:1050682690280:web:073dc506a6b33d167a575d",
  measurementId: "G-Y7BDHZ5XED"
}

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
