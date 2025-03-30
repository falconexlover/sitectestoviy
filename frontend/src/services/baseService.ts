import api from './api';
import { AxiosResponse } from 'axios';

/**
 * Базовый сервис для стандартизации доступа к API
 * Содержит общие методы для работы с API и обработки ошибок
 */
export default class BaseService {
  protected resourcePath: string;
  protected resourceName: string;

  /**
   * Конструктор базового сервиса
   * @param resourcePath - Базовый путь к ресурсу API
   * @param resourceName - Название ресурса для логов
   */
  constructor(resourcePath: string, resourceName?: string) {
    this.resourcePath = resourcePath;
    this.resourceName = resourceName || resourcePath.replace('/', '');
    console.debug(`Инициализирован сервис для ресурса: ${this.resourceName}`);
  }

  /**
   * Выполнение GET-запроса
   * @param endpoint - Конечная точка API
   * @param params - Параметры запроса
   * @param logMessage - Сообщение для логирования
   * @returns Результат запроса
   */
  protected async get<T>(endpoint: string = '', params: Record<string, any> = {}, logMessage?: string): Promise<AxiosResponse<T>> {
    try {
      const path = `${this.resourcePath}${endpoint}`;
      console.debug(logMessage || `Получение ${this.resourceName}${endpoint ? `: ${endpoint}` : ''}`);
      return await api.get<T>(path, { params });
    } catch (error) {
      console.error(`Ошибка при получении ${this.resourceName}${endpoint ? `: ${endpoint}` : ''}`, error);
      throw error;
    }
  }

  /**
   * Выполнение POST-запроса
   * @param endpoint - Конечная точка API
   * @param data - Данные для отправки
   * @param logMessage - Сообщение для логирования
   * @returns Результат запроса
   */
  protected async post<T>(endpoint: string = '', data: Record<string, any> = {}, logMessage?: string): Promise<AxiosResponse<T>> {
    try {
      const path = `${this.resourcePath}${endpoint}`;
      console.debug(logMessage || `Создание ${this.resourceName}${endpoint ? ` [${endpoint}]` : ''}`);
      const response = await api.post<T>(path, data);
      console.info(`Успешно создан ${this.resourceName}${endpoint ? ` [${endpoint}]` : ''}`);
      return response;
    } catch (error) {
      console.error(`Ошибка при создании ${this.resourceName}${endpoint ? ` [${endpoint}]` : ''}`, error);
      throw error;
    }
  }

  /**
   * Выполнение PUT-запроса
   * @param endpoint - Конечная точка API
   * @param data - Данные для обновления
   * @param logMessage - Сообщение для логирования
   * @returns Результат запроса
   */
  protected async put<T>(endpoint: string = '', data: Record<string, any> = {}, logMessage?: string): Promise<AxiosResponse<T>> {
    try {
      const path = `${this.resourcePath}${endpoint}`;
      console.debug(logMessage || `Обновление ${this.resourceName}${endpoint ? `: ${endpoint}` : ''}`);
      const response = await api.put<T>(path, data);
      console.info(`Успешно обновлен ${this.resourceName}${endpoint ? `: ${endpoint}` : ''}`);
      return response;
    } catch (error) {
      console.error(`Ошибка при обновлении ${this.resourceName}${endpoint ? `: ${endpoint}` : ''}`, error);
      throw error;
    }
  }

  /**
   * Выполнение DELETE-запроса
   * @param endpoint - Конечная точка API
   * @param logMessage - Сообщение для логирования
   * @returns Результат запроса
   */
  protected async delete<T>(endpoint: string = '', logMessage?: string): Promise<AxiosResponse<T>> {
    try {
      const path = `${this.resourcePath}${endpoint}`;
      console.debug(logMessage || `Удаление ${this.resourceName}${endpoint ? `: ${endpoint}` : ''}`);
      const response = await api.delete<T>(path);
      console.info(`Успешно удален ${this.resourceName}${endpoint ? `: ${endpoint}` : ''}`);
      return response;
    } catch (error) {
      console.error(`Ошибка при удалении ${this.resourceName}${endpoint ? `: ${endpoint}` : ''}`, error);
      throw error;
    }
  }
} 