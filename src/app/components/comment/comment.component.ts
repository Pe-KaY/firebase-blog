import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { comment } from '../../interfaces/blog-interfaces';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { BlogServiceService } from '../../services/blogService/blog-service.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  @Input() comment!: comment;
  @Input() blogId!: string;
  editCommentForm!: FormGroup;
  editComment = false;

  constructor(
    private fb: FormBuilder,
    public blogService: BlogServiceService,
    public auth: Auth
  ) {
    this.editCommentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  saveComment() {
    this.blogService.editComment(
      this.blogId,
      this.comment.id,
      this.editCommentForm.value
    );
    this.editCommentForm.reset();
  }

  // edit comment
  edit() {
    this.editComment = true;
  }

  cancel() {
    this.editComment = false;
  }
}
