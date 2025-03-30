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

// RoomType используется в компоненте RoomCard
export interface RoomType {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  images: string[] | string;
  amenities: string[];
  optimizedImages?: Array<{
    small?: string;
    medium?: string;
    large?: string;
  }>;
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