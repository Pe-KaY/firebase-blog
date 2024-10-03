import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { blog } from '../../interfaces/blog-interfaces';
import { updateDoc } from 'firebase/firestore';
import { comment } from '../../interfaces/blog-interfaces';

@Injectable({
  providedIn: 'root',
})
export class BlogServiceService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Add a blog post
  addBlog(blog: blog) {
    const blogsRef = collection(this.firestore, 'blogs');
    return addDoc(blogsRef, {
      ...blog,
      authorId: this.auth.currentUser?.uid, // Attach the author's user ID
      timestamp: new Date(),
      author: this.auth.currentUser?.displayName,
    });
  }

  // Fetch all blog posts
  getBlogs(): Observable<blog[]> {
    const blogsRef = collection(this.firestore, 'blogs');
    return collectionData(blogsRef, { idField: 'id' }) as Observable<blog[]>;
  }
  // get Comments
  getComments(blodId: string) {
    const commentsRef = collection(this.firestore, `blogs/${blodId}/comments`);
    return collectionData(commentsRef, { idField: 'id' }) as Observable<
      comment[]
    >;
  }

  // edit blog post
  editBlog(blogId: string, updatedblog: blog) {
    const blogRef = doc(this.firestore, `blogs/${blogId}`);
    return updateDoc(blogRef, {
      ...updatedblog,
      timestamp: this.getCurrentFormattedDate(),
      authorId: this.auth.currentUser?.uid,
      author: this.auth.currentUser?.displayName,
    });
  }

  // add comment
  addComment(blogId: string, comment: comment) {
    const commentsRef = collection(this.firestore, `blogs/${blogId}/comments`);
    return addDoc(commentsRef, {
      ...comment,
      timeStamp: this.getCurrentFormattedDate(),
      authorId: this.auth.currentUser?.uid,
      author: this.auth.currentUser?.displayName,
    });
  }

  // edit comment
  editComment(blogId: string, commentId: string, updatedComment: comment) {
    const commentRef = doc(
      this.firestore,
      `blogs/${blogId}/comments/${commentId}`
    );
    return updateDoc(commentRef, {
      ...updatedComment,
      timeStamp: this.getCurrentFormattedDate(),
      authorId: this.auth.currentUser?.uid,
      author: this.auth.currentUser?.displayName,
    });
  }

  // delete comment
  deleteComment(blogId: string, commentId: string) {
    const commentRef = doc(
      this.firestore,
      `blogs/${blogId}/comments/${commentId}`
    );
    deleteDoc(commentRef)
      .then(() => {
        console.log('Comment deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
  }

  // delete blog post
  deleteBlog(blogId: string) {
    const blogRef = doc(this.firestore, `blogs/${blogId}`);
    deleteDoc(blogRef)
      .then(() => {
        console.log('Blog deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting blog:', error);
      });
  }

  // current date
  getCurrentFormattedDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based
    const year = today.getFullYear().toString().slice(-2); // Get last two digits of year
    return `${day}/${month}/${year}`;
  }
}
