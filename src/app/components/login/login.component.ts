import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthenticationService } from '../../services/auth-services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = false;
  localstorage = typeof window !== 'undefined';

  constructor(
    private formBuilder: FormBuilder,
    public authorizationService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.loading = true;
    this.authorizationService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .then(
        () => {
          if (this.localstorage) {
            localStorage.setItem('username', this.loginForm.value.email);
          }
          this.authorizationService.userLogin = true;
          setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/home']);
          }, 5000);
        },
        (err) => {
          setTimeout(() => {
            this.loading = false;
            this.errorMessage = true;
          }, 5000);
        }
      );
  }
}
