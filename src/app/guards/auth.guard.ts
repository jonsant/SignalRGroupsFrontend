import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // If passcode is not required, allow access
  if (!environment.requirePasscode) {
    return true;
  }

  // Check if passcode exists in session storage
  const passcode = sessionStorage.getItem('passcode');

  if (!passcode) {
    // Redirect to home page if no passcode found
    router.navigate(['/']);
    return false;
  }

  return true;
};
