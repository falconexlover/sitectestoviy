export interface Customer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  bookingsCount: number;
  totalSpent: number;
  lastBooking?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStats {
  totalBookings: number;
  totalSpent: number;
  averageStay: number;
  favoriteRoomTypes: { [key: string]: number };
  bookingHistory: Array<{
    id: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    status: string;
  }>;
  loyaltyPoints: number;
  loyaltyLevel: string;
} 