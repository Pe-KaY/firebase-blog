import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth, private router: Router) {}

  userLogin = false;
  modal = false;
  // Register a new user
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login user
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // login with google
  // Google Sign-In
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      console.log('User signed in:', result.user);
      this.router.navigate(['home']); // Navigate to dashboard after login
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  }

  // Logout user
  logout() {
    this.router.navigate(['']);
    signOut(this.auth);
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser?.uid;
  }
}
