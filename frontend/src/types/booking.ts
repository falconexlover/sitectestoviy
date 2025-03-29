import { User } from './auth';
import { Room } from './models';
import { ApiResponse } from './api';

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

export interface BookingService {
  createBooking: (bookingData: BookingData) => Promise<ApiResponse<Booking>>;
  getBooking: (id: string) => Promise<ApiResponse<Booking>>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<ApiResponse<Booking>>;
  cancelBooking: (id: string) => Promise<ApiResponse<Booking>>;
  getBookings: () => Promise<ApiResponse<Booking[]>>;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'; 