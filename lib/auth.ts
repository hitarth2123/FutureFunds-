import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth } from "./firebase"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export function signUp(
  email: string,
  password: string,
  name: string,
): { success: boolean; error?: string; user?: User } {
  // NOTE: Synchronous signature retained for compatibility; perform async under the hood
  // Consumers should prefer signUpAsync for proper error handling
  // Kept to avoid broad refactors; see signUpAsync below
  throw new Error("Use signUpAsync instead")
}

export async function signUpAsync(
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name })
    }
    const firebaseUser = cred.user
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      name: firebaseUser.displayName || name,
      createdAt: new Date().toISOString(),
    }
    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error?.message || "Sign up failed" }
  }
}

export function signIn(email: string, password: string): { success: boolean; error?: string; user?: User } {
  // Synchronous wrapper not suitable for Firebase; keep for compatibility
  throw new Error("Use signInAsync instead")
}

export async function signInAsync(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = cred.user
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      name: firebaseUser.displayName || "User",
      createdAt: new Date().toISOString(),
    }
    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error?.message || "Sign in failed" }
  }
}

export async function signInWithGoogle(): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "User",
      createdAt: new Date().toISOString(),
    }
    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message || "Google sign-in failed" }
  }
}

export function signOut(): void {
  // kept for API compatibility; prefer signOutWithFirebase
}

export async function signOutWithFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Sign out error:", error)
  }
}

export function getCurrentUser(): User | null {
  const u = auth.currentUser
  if (!u) return null
  return {
    id: u.uid,
    email: u.email || "",
    name: u.displayName || "User",
    createdAt: new Date().toISOString(),
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "User",
        createdAt: new Date().toISOString(),
      }
      callback(user)
    } else {
      callback(null)
    }
  })
}
