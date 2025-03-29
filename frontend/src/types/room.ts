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