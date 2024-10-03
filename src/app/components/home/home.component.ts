import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogServiceService } from '../../services/blogService/blog-service.service';
import { map, Observable } from 'rxjs';
import { blog } from '../../interfaces/blog-interfaces';
import { Auth, updateProfile } from '@angular/fire/auth';
// import storage
import {
  ref,
  uploadBytes,
  getDownloadURL,
  Storage,
} from '@angular/fire/storage';

// import form
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
// import data service
import { DataServiceService } from '../../services/dataService/data-service.service';
// import authorization service
import { AuthenticationService } from '../../services/auth-services/authentication.service';
// import components
import { BlogsComponent } from '../blogs/blogs.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BlogsComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  getBlogs$!: Observable<blog[]>;
  myBLogs$!: Observable<blog[]>;
  @ViewChild('bell') bell!: ElementRef;

  postForm!: FormGroup;
  constructor(
    private blogService: BlogServiceService,
    private fb: FormBuilder,
    public dataService: DataServiceService,
    public authorizationService: AuthenticationService,
    public auth: Auth,
    private storage: Storage
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getBlogs$ = this.blogService.getBlogs();
    this.myBLogs$ = this.blogService
      .getBlogs()
      .pipe(
        map((blogs) =>
          blogs.filter((blog) => blog.authorId === this.auth.currentUser?.uid)
        )
      );

    // Notification
    this.getBlogs$.subscribe((blogs) => {
      const newComment = blogs[blogs.length - 1]; // Last comment
      if (newComment) {
        this.notifyUser();
      }
    });
  }

  addBlog() {
    if (this.postForm.valid) {
      const blog = this.postForm.value;
      this.blogService.addBlog(blog);
      this.postForm.reset();
    }
  }

  // profile picture
  uploadProfilePhoto(event: any) {
    const file = event.target.files[0];
    if (file && this.auth.currentUser) {
      const storageRef = ref(
        this.storage,
        `profilePhotos/${this.auth.currentUser.uid}`
      );

      // Upload file to Firebase Storage
      uploadBytes(storageRef, file)
        .then(() => {
          // Get the download URL of the uploaded photo
          return getDownloadURL(storageRef);
        })
        .then((downloadURL) => {
          // Update the user's profile with the photo URL
          if (this.auth.currentUser)
            updateProfile(this.auth.currentUser, {
              photoURL: downloadURL,
            });
        })
        .then(() => {
          console.log('Profile photo updated successfully');
        })
        .catch((error) => {
          console.error('Error uploading profile photo:', error);
        });
    }
  }

  // notification
  notification = 'No new blog Updates';
  notifyUser() {
    this.notification = `Blogs Updated ✅`;
    this.bell.nativeElement.classList.toggle('noti');
    setTimeout(() => {
      this.notification = 'No new blog Updates';
      this.bell.nativeElement.classList.toggle('noti');
    }, 5000);
  }
}
