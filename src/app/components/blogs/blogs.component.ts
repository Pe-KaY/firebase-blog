import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { blog, comment } from '../../interfaces/blog-interfaces';
// import data service
import { BlogServiceService } from '../../services/blogService/blog-service.service';
import { Observable } from 'rxjs';
// import auth
import { Auth } from '@angular/fire/auth';
// import comments component
import { CommentComponent } from '../comment/comment.component';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, CommentComponent, ReactiveFormsModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss',
})
export class BlogsComponent {
  postForm!: FormGroup;
  comentForm!: FormGroup;
  addEditBlog = false;
  addComment = false;
  commentIsEmpty = true;
  @Input() blog!: blog;
  @ViewChild('viewComments') viewComments!: ElementRef;

  constructor(
    public blogService: BlogServiceService,
    public auth: Auth,
    private fb: FormBuilder
  ) {
    // edit blog post form   
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });

    // comment form
    this.comentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  getBlogComments() {}
  comments$!: Observable<comment[]>;

  ngOnInit() {
    this.postForm.patchValue(this.blog);
    this.comments$ = this.blogService.getComments(this.blog.id);

    // check if comment is not empty
    this.comments$.subscribe((comments) => {
      if (comments.length > 0) {
        this.commentIsEmpty = false;
      }
    });
  }

  // view comments
  toggleComments() {
    if (this.commentIsEmpty) return;
    this.viewComments.nativeElement.classList.toggle('open');
  }

  // edit blog post
  editBlog() {
    this.addEditBlog = true;
  }

  // cancel
  cancel() {
    this.addEditBlog = false;
  }

  // save
  save() {
    this.blogService.editBlog(this.blog.id, this.postForm.value);
    this.addEditBlog = false;
  }

  // add comment
  togggleAddComment() {
    this.addComment = true;
  }
  // savecomment
  saveComment() {
    this.blogService.addComment(this.blog.id, this.comentForm.value);
    this.comentForm.reset();
    this.addComment = false;
    if (!this.viewComments.nativeElement.classList.contains('open'))
      this.toggleComments();
  }

  // cancel comment
  cancelComment() {
    this.addComment = false;
    this.comentForm.reset();
  }
}
