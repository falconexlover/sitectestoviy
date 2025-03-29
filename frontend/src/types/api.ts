/**
 * Интерфейсы и типы для работы с API
 */

import { AuthError } from './auth';

export interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
  error?: any;
}

export interface ApiErrorDetails {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Расширяем типы для axios
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface SuccessResponse {
  status: number;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sort?: string;
}

export type ApiParams = PaginationParams & SortParams & {
  [key: string]: any;
};

export interface ApiConfig {
  TIMEOUT: number;
  RETRY_ATTEMPTS: number;
  RETRY_DELAY: number;
}

export interface Room {
  id: string;
  number: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  type: 'standard' | 'deluxe' | 'suite' | 'family';
  size: number;
  amenities: string[];
  images: string[];
  floor: number;
  area: number;
  status: 'available' | 'occupied' | 'maintenance';
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingData {
  startDate: Date;
  endDate: Date;
  guestCount: number;
  userId: string;
  roomId: string;
  totalPrice: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface RoomService {
  getAllRooms: () => Promise<{ data: Room[] }>;
  getRoom: (id: string) => Promise<{ data: Room }>;
}

export interface BookingService {
  create: (data: BookingData) => Promise<{ data: { id: string } }>;
  getBooking: (id: string) => Promise<{ data: BookingData }>;
} 