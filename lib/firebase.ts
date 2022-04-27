import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyACiJCYrSlLqb7t1z1iWUwRzRoW0pW6H6g",
    authDomain: "nextfire-64c11.firebaseapp.com",
    projectId: "nextfire-64c11",
    storageBucket: "nextfire-64c11.appspot.com",
    messagingSenderId: "700648563521",
    appId: "1:700648563521:web:9ec6558c2d30044587f7c0",
    measurementId: "G-3C2L3SLHL8"
};

if (!firebase?.apps?.length) {
    firebase.initializeApp(firebaseConfig);
}

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

// Helper functions

/**
 * Get a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username: string) {
    const userRef = firestore.collection('users');
    const query = userRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! Firestore returns timestamps as Date objects, but we want them as numbers
        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    }
}
