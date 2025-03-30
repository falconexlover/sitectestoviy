import axios from 'axios';
import { Review, ReviewWithUser, ReviewFilter, ReviewStats } from '../types/reviews';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Сервис для работы с отзывами
 */
export const reviewService = {
  /**
   * Получить все отзывы
   */
  async getReviews(filter?: ReviewFilter, page: number = 1, limit: number = 10): Promise<{ reviews: ReviewWithUser[], total: number }> {
    let url = `${API_URL}/reviews?page=${page}&limit=${limit}`;
    
    if (filter) {
      if (filter.status) url += `&status=${filter.status}`;
      if (filter.roomId) url += `&roomId=${filter.roomId}`;
      if (filter.userId) url += `&userId=${filter.userId}`;
      if (filter.rating) url += `&rating=${filter.rating}`;
      if (filter.sentimentLabel) url += `&sentimentLabel=${filter.sentimentLabel}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  },

  /**
   * Получить отзывы для модерации
   */
  async getModerationReviews(filter?: ReviewFilter, page: number = 1): Promise<{ reviews: ReviewWithUser[], total: number }> {
    return this.getReviews({ ...filter, status: 'pending' }, page);
  },

  /**
   * Добавить новый отзыв
   */
  async addReview(reviewData: Partial<Review>): Promise<Review> {
    const response = await axios.post(`${API_URL}/reviews`, reviewData);
    return response.data;
  },

  /**
   * Обновить отзыв
   */
  async updateReview(id: string, reviewData: Partial<Review>): Promise<Review> {
    const response = await axios.put(`${API_URL}/reviews/${id}`, reviewData);
    return response.data;
  },

  /**
   * Удалить отзыв
   */
  async deleteReview(id: string): Promise<void> {
    await axios.delete(`${API_URL}/reviews/${id}`);
  },

  /**
   * Модерировать отзыв
   */
  async moderateReview(id: string, status: 'approved' | 'rejected'): Promise<Review> {
    const response = await axios.patch(`${API_URL}/reviews/${id}/moderate`, { status });
    return response.data;
  },

  /**
   * Анализировать тональность отзыва
   */
  async analyzeSentiment(id: string): Promise<Review> {
    const response = await axios.post(`${API_URL}/reviews/${id}/analyze`);
    return response.data;
  },

  /**
   * Получить статистику по отзывам
   */
  async getReviewStats(roomId?: string): Promise<ReviewStats> {
    let url = `${API_URL}/reviews/stats`;
    if (roomId) url += `?roomId=${roomId}`;
    
    const response = await axios.get(url);
    return response.data;
  },

  /**
   * Добавить ответ на отзыв
   */
  async respondToReview(id: string, responseText: string): Promise<Review> {
    const response = await axios.post(`${API_URL}/reviews/${id}/respond`, { 
      text: responseText,
      author: 'Администрация',
      date: new Date().toISOString() 
    });
    return response.data;
  },

  /**
   * Отметить отзыв как полезный
   */
  async markAsHelpful(id: string): Promise<Review> {
    const response = await axios.post(`${API_URL}/reviews/${id}/helpful`);
    return response.data;
  }
}; 