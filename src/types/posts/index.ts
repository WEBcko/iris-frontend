export type Comment = {
  id: number;
  username: string;
  content: string;
  user_image: string;
  liked_by_user: boolean;
  user?: { profile_image?: string };
};


export type CreatePostInput = {
  title: string;
  description?: string;
  image?: FileList;
};

export type ListMyPostsResponse = {
  favorite_number: number;
  comments_number: number;
  author_image: string;
  favorited_by_user: boolean;
  author: string;
  comments: Comment[]; 
  description: string;
  id: number;
  image_url: string;
  title: string;
  user_id: number;
  profile_image: string;
}[];

export type Post = {
  id: number;
  author: string;
  title: string;
  description: string;
  image_url: string;
  user_id: number;
  profile_image: string;
  comments: Comment[]; 
};

