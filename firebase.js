import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvilACj8eVGpFDeJuLRLEuHfplrCbLJsw",
  authDomain: "ridwan-ragib.firebaseapp.com",
  projectId: "ridwan-ragib",
  storageBucket: "ridwan-ragib.firebasestorage.app",
  messagingSenderId: "1027055793581",
  appId: "1:1027055793581:web:78a84ba7028283874f5d24",
  measurementId: "G-NTK0GLWRM4",
};

export const CLOUDINARY = { cloudName: "wswiilug", uploadPreset: "atifaj" };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const POSTS = "posts";

export async function fetchPosts() {
  const snap = await getDocs(query(collection(db, POSTS), orderBy("createdAt", "desc"), limit(100)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function fetchPost(id) {
  const s = await getDoc(doc(db, POSTS, id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
}
export function createPost(data) {
  return addDoc(collection(db, POSTS), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export function updatePost(id, data) {
  return updateDoc(doc(db, POSTS, id), { ...data, updatedAt: serverTimestamp() });
}
export function deletePost(id) {
  return deleteDoc(doc(db, POSTS, id));
}

export const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
export const logout = () => signOut(auth);
export const watchAuth = (cb) => onAuthStateChanged(auth, cb);
