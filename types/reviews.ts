export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    // avatar?: string;
  };
  rating: number;
  comment: string;
  images?: Array<{ url: string }>;
  helpfulCount: number;
  isHelpful?: boolean;
  createdAt: string;
  isEdited: boolean;
  replies?: Array<{
    userId: { name: string };
    comment: string;
    createdAt: string;
  }>;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: Array<{ _id: number; count: number }>;
}
