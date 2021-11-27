export interface Blog {
  title: string;
  author: string;
  url: string;
  likes: number;
}

export interface BlogResponse {
  id: string;
  title: string;
  author: string;
  url: string;
  likes: number;
}

export type CreateBlogBody = Blog & {
  userId: string;
};

export type UpdateBlogBody = Blog & {
  userId: string;
};
