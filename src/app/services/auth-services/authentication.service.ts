import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
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
