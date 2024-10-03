import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/auth-services/authentication.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { updateProfile } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  SignupForm!: FormGroup;
  loading = false;
  errorMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    public authorizationService: AuthenticationService,
    private router: Router
  ) {
    this.SignupForm = this.formBuilder.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeatpassword: ['', Validators.required],
    });
  }

  signup() {
    if (
      this.SignupForm.value.password !== this.SignupForm.value.repeatpassword
    ) {
      this.errorMessage = true;
      setTimeout(() => {
        this.errorMessage = false;
      }, 5000);
      return;
    }
    this.loading = true;
    this.authorizationService
      .register(this.SignupForm.value.email, this.SignupForm.value.password)
      .then(
        (userCredential) => {
          const user = userCredential.user;
          const username = this.SignupForm.value.username;
          // Set the display name (username)
          updateProfile(user, { displayName: username });
          this.authorizationService.userLogin = true;
          setTimeout(() => {
            this.loading = false;
            this.router.navigate(['']);
            // this.dataService.modal = false;
          }, 5000);
        },
        (err) => {
          console.log(err);

          setTimeout(() => {
            this.loading = false;
            this.errorMessage = true;
          }, 5000);
        }
      );
  }
}
