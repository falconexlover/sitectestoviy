export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'manager' | 'admin' | 'moderator';
  address?: string;
}

export interface Room {
  id: string;
  number: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  type: 'standard' | 'deluxe' | 'suite' | 'family';
  roomType: 'standard' | 'deluxe' | 'suite' | 'family';
  size: number;
  amenities: string[];
  images: string[];
  floor: number;
  area: number;
  beds: string;
  bathrooms: number;
  status: 'available' | 'occupied' | 'maintenance';
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  roomId: string;
  room?: Room;
  user?: User;
}

export interface Review {
  id: string;
  userId: string;
  roomId: string;
  rating: number;
  comment: string;
  photos?: string[];
  isVerified: boolean;
  createdAt: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationComment?: string;
  moderatedAt?: string;
  sentimentLabel?: 'positive' | 'neutral' | 'negative';
  sentimentScore?: number;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
}

export type ReviewFilter = 'all' | 'pending' | 'approved' | 'rejected';

export interface ModerationData {
  status: 'approved' | 'rejected';
  moderationComment?: string;
} 