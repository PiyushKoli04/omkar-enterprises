// ============================================================
// AUTH MODULE — SwiftShip
// Handles Google + Email/Password auth, session, user storage
// ============================================================

import { auth, db, ADMIN_UID } from '../firebase-config.js';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  doc, setDoc, getDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { showToast } from './ui.js';

const googleProvider = new GoogleAuthProvider();

// Current user state (reactive)
let currentUser = null;
const authListeners = [];

export function onUserChange(cb) {
  authListeners.push(cb);
}

export function getCurrentUser() {
  return currentUser;
}

export function isAdmin() {
  return currentUser && currentUser.uid === ADMIN_UID;
}

export function isLoggedIn() {
  return !!currentUser;
}

// ── Initialize auth listener ───────────────────────────────
export function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await ensureUserDoc(user);
      currentUser = user;
    } else {
      currentUser = null;
    }
    authListeners.forEach(cb => cb(currentUser));
  });
}

// ── Store user data in Firestore ───────────────────────────
async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: user.uid === ADMIN_UID ? 'admin' : 'user',
      createdAt: serverTimestamp()
    });
  }
}

// ── Google Sign-In ─────────────────────────────────────────
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    showToast(`Welcome, ${result.user.displayName || 'User'}!`, 'success');
    return result.user;
  } catch (err) {
    showToast(getAuthError(err.code), 'error');
    throw err;
  }
}

// ── Email Registration ─────────────────────────────────────
export async function registerWithEmail(name, email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await ensureUserDoc({ ...cred.user, displayName: name });
    showToast('Account created successfully!', 'success');
    return cred.user;
  } catch (err) {
    showToast(getAuthError(err.code), 'error');
    throw err;
  }
}

// ── Email Login ────────────────────────────────────────────
export async function loginWithEmail(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    showToast(`Welcome back, ${cred.user.displayName || 'User'}!`, 'success');
    return cred.user;
  } catch (err) {
    showToast(getAuthError(err.code), 'error');
    throw err;
  }
}

// ── Sign Out ───────────────────────────────────────────────
export async function logout() {
  try {
    await signOut(auth);
    showToast('Logged out successfully.', 'info');
  } catch (err) {
    showToast('Logout failed. Please try again.', 'error');
  }
}

// ── Error messages ─────────────────────────────────────────
function getAuthError(code) {
  const map = {
    'auth/email-already-in-use':  'This email is already registered.',
    'auth/invalid-email':          'Invalid email address.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password.',
    'auth/too-many-requests':      'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user':   'Sign-in popup was closed.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential':     'Invalid credentials. Check email & password.',
  };
  return map[code] || 'Authentication error. Please try again.';
}
