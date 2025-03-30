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
  role: UserRole;
  phone?: string;
  avatar?: string;
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
  type: RoomType;
  isAvailable: boolean;
  floor: number;
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

// Тип для API запросов
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
} 