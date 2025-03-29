export interface AnalyticsData {
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
  totalBookings: number;
  revenueGrowth: number;
  popularRoomTypes: Array<{
    type: string;
    count: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  customerSatisfaction: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
}

export interface OccupancyForecast {
  dates: string[];
  occupancyRates: number[];
  roomAvailability: Array<{
    date: string;
    availableRooms: number;
    totalRooms: number;
  }>;
}

export interface PopularRooms {
  id: string;
  name: string;
  type: string;
  bookingsCount: number;
  revenue: number;
  rating: number;
}

export interface RevenuePeriod {
  period: string;
  revenue: number;
  bookings: number;
}

export interface OccupancyPeriod {
  period: string;
  occupancy: number;
  rooms: number;
} 