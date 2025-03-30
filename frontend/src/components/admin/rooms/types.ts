import { Room as ApiRoom } from '../../../types/services';

// Совместимый с API тип комнаты для внутреннего использования в компоненте
export interface Room {
  id: string;
  number: string;
  title: string; // соответствует name в API
  description: string;
  price: number;
  capacity: number;
  type: string;
  beds: number; // в API это строка, но мы преобразуем
  bathrooms: number;
  area: number;
  amenities: string[];
  images?: string[];
  isActive: boolean;
}

// Тип для формы редактирования/создания номера
export interface RoomFormData {
  number: string;
  title: string;
  type: string;
  price: string;
  capacity: string;
  beds: string;
  bathrooms: string;
  area: string;
  description: string;
  amenities: string[];
  images: string;
  isActive: boolean;
}

// Преобразование из API типа в внутренний тип
export const mapApiRoomToRoom = (apiRoom: ApiRoom): Room => ({
  id: apiRoom.id,
  number: apiRoom.number,
  title: apiRoom.name,
  description: apiRoom.description,
  price: apiRoom.price,
  capacity: apiRoom.capacity,
  type: apiRoom.type,
  beds: typeof apiRoom.beds === 'string' ? parseInt(apiRoom.beds, 10) : apiRoom.beds,
  bathrooms: apiRoom.bathrooms,
  area: apiRoom.area,
  amenities: apiRoom.amenities || [],
  images: apiRoom.images,
  isActive: apiRoom.isActive,
});

// Преобразование в API формат
export const mapRoomToApiRoom = (room: Partial<Room>): Partial<ApiRoom> & { name: string, size: number } => ({
  id: room.id,
  number: room.number || '',
  name: room.title || '', // Обязательное поле для API
  description: room.description || '',
  price: room.price || 0,
  capacity: room.capacity || 0,
  type: (room.type as 'standard' | 'deluxe' | 'suite' | 'family') || 'standard',
  size: 0, // требуется для API
  beds: room.beds?.toString() || '1',
  bathrooms: room.bathrooms || 0,
  area: room.area || 0,
  amenities: room.amenities || [],
  images: room.images || [],
  isActive: room.isActive ?? true,
});

// Константы
export const roomTypes = [
  { value: 'standard', label: 'Стандартный' },
  { value: 'deluxe', label: 'Делюкс' },
  { value: 'suite', label: 'Люкс' },
  { value: 'family', label: 'Семейный' },
  { value: 'business', label: 'Бизнес' },
];

export const amenitiesList = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'tv', label: 'Телевизор' },
  { value: 'airConditioning', label: 'Кондиционер' },
  { value: 'minibar', label: 'Мини-бар' },
  { value: 'safeBox', label: 'Сейф' },
  { value: 'bathtub', label: 'Ванна' },
  { value: 'balcony', label: 'Балкон' },
  { value: 'kitchen', label: 'Кухня' },
  { value: 'workspace', label: 'Рабочее место' },
]; 