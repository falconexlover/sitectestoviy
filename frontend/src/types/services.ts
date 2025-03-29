import type { Review, ReviewWithUser } from './reviews';
import type { User } from './user';
import type { Customer, CustomerStats } from './customer';
import type { AnalyticsData, OccupancyForecast, PopularRooms } from './analytics';

export interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

// Типы для bookingService
export interface BookingData {
  roomId: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  status: BookingStatus;
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Типы для roomService
export interface Room {
  id: string;
  name: string;
  type: 'standard' | 'deluxe' | 'suite' | 'family';
  description: string;
  price: number;
  capacity: number;
  size: number;
  rating?: number;
  images?: string[];
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
  number: string;
  roomType: 'standard' | 'deluxe' | 'suite' | 'family';
  floor: number;
  area: number;
  beds: string;
  bathrooms: number;
  status: 'available' | 'occupied' | 'maintenance';
  isActive: boolean;
}

export interface RoomData {
  name: string;
  type: 'standard' | 'deluxe' | 'suite' | 'family';
  description: string;
  price: number;
  capacity: number;
  size: number;
  amenities: string[];
  images: string[];
}

export interface RoomAvailabilityParams {
  startDate: string;
  endDate: string;
  guestCount?: number;
}

export interface UserService {
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (userData: Partial<User>) => Promise<ApiResponse<User>>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<ApiResponse<{ success: boolean }>>;
  deleteAccount: () => Promise<ApiResponse<{ success: boolean }>>;
}

export interface AuthService {
  login: (credentials: { email: string; password: string }) => Promise<ApiResponse<{ token: string; user: User }>>;
  register: (userData: Partial<User>) => Promise<ApiResponse<{ token: string; user: User }>>;
  getProfile: () => Promise<ApiResponse<User>>;
  updateProfile: (userData: Partial<User>) => Promise<ApiResponse<User>>;
  logout: () => Promise<ApiResponse<{ success: boolean }>>;
  refreshToken: () => Promise<ApiResponse<{ token: string }>>;
}

export interface RoomService {
  getAll: () => Promise<ApiResponse<Room[]>>;
  getById: (id: string) => Promise<ApiResponse<Room>>;
  createRoom: (roomData: Partial<Room>) => Promise<ApiResponse<Room>>;
  updateRoom: (id: string, roomData: Partial<Room>) => Promise<ApiResponse<Room>>;
  deleteRoom: (id: string) => Promise<ApiResponse<void>>;
  checkAvailability: (roomId: string, startDate: string, endDate: string) => Promise<ApiResponse<{ available: boolean }>>;
}

export interface RoomFilter {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  featured?: boolean;
  sort?: string;
  limit?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
  amenities?: string[];
}

export type { Review, ReviewWithUser, User, Customer, CustomerStats, AnalyticsData, OccupancyForecast, PopularRooms }; 