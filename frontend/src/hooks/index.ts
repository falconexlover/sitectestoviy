/**
 * Единая система хуков
 * 
 * Экспортирует все хуки из разных категорий для удобного использования.
 */

// Основные хуки для базовых операций
export * from './core/useLocalStorage';
export * from './core/useForm';
export * from './core/useDebounce';
export * from './core/useMediaQuery';

// Хуки для работы с API и сетевыми запросами
export * from './api/useApi';
export * from './api/useAuth';
export * from './api/useRoom';

// Хуки для работы с интерфейсом
export * from './ui/useToast';
export * from './ui/useModal';

// Хуки для конкретных доменных задач
export * from './domain/useBooking';
export * from './domain/useTestimonials'; 