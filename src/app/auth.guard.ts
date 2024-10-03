import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth'; 
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.currentUser) {
    return true; // Allow access if the user is authenticated
  } else {
    router.navigate(['']); // Redirect to login if not authenticated
    return false;
  }
};
