export interface Review {
  id: string;
  carId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  date: string;
  verified?: boolean;
  helpful?: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  isFriend?: boolean;
}

export interface FriendComparison {
  carId: string;
  yourReview?: Review;
  friendReviews: Review[];
}

