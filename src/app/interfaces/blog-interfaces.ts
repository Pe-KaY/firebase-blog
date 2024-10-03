export interface blog {
  id: string;
  author: string;
  content: string;
  title: string;
  timeStamp: string;
  authorId: string;
}

export interface comment {
  id: string
  author: string;
  authorId: string;
  content: string;
  timeStamp: string;
}
