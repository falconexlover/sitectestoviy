// Типы пользователей
export enum UserRole {
  GUEST = 'guest',
  CLIENT = 'client',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Типы номеров
export interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  images: string[];
  amenities: string[];
}

export interface Room {
  id: string;
  number: string;
  typeId: string;
  isAvailable: boolean;
  floor: number;
  createdAt: Date;
  updatedAt: Date;
}

// Типы бронирования
export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: BookingStatus;
  guestCount: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

// Типы для API
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 