import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  constructor() {}

  allBlogs = true;
  myBlogs = false;
  addEditBlog = false;

  reset() {
    this.allBlogs = false;
    this.myBlogs = false;
    this.addEditBlog = false;
  }

  // all blogs
  allBlogsView() {
    this.reset();
    this.allBlogs = true;
  }

  // myBlogs
  myBlogsView() {
    this.reset();
    this.myBlogs = true;
  }

  // add blog
  addEditBlogView() {
    this.reset();
    this.addEditBlog = true;
  }
}
