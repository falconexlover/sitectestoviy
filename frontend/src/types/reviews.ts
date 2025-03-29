import { User } from './user';

export interface Review {
  id: string;
  roomId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  sentimentLabel?: 'positive' | 'neutral' | 'negative';
  createdAt: string;
  updatedAt: string;
  response?: {
    author: string;
    text: string;
    date: string;
  };
  helpful?: number;
}

export interface ReviewWithUser extends Review {
  user: User;
}

export interface ReviewFilter {
  status?: 'pending' | 'approved' | 'rejected';
  roomId?: string;
  userId?: string;
  rating?: number;
  sentimentLabel?: 'positive' | 'neutral' | 'negative';
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  recommendationRate: number;
  responseRate: number;
  ratingDistribution: {
    [key: number]: number;
  };
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  trends: Array<{
    direction: 'up' | 'down';
    value: string;
    description: string;
  }>;
  topKeywords?: Array<{
    text: string;
    weight: number;
  }>;
} 