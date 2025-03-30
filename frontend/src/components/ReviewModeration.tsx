import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Review, ReviewWithUser, ReviewFilter } from '../types/reviews';
import { User } from '../types/user';
import { reviewService } from '../services/reviewService';
import StarRating from './StarRating';

const ErrorMessage = styled.div`
  color: var(--error-color);
  padding: 1rem;
  background-color: rgba(220, 53, 69, 0.1);
  border-radius: var(--radius-sm);
  margin: 1rem 0;
  text-align: center;
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReviewDate = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ReviewContent = styled.div`
  margin: 1rem 0;
`;

const ReviewTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: string }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return 'var(--success-color)';
      case 'danger':
        return 'var(--error-color)';
      case 'info':
        return 'var(--info-color)';
      default:
        return 'var(--primary-color)';
    }
  }};
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ReviewModerationProps {
  user: User;
}

const ReviewModeration: React.FC<ReviewModerationProps> = ({ user }) => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReviewFilter>({
    status: 'pending'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadReviews();
  }, [filter, currentPage]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getModerationReviews(filter, currentPage);
      setReviews(response.reviews as ReviewWithUser[]);
      setTotalPages(Math.ceil(response.total / 10)); // Предполагаем 10 элементов на страницу
    } catch (error) {
      setError('Ошибка при загрузке отзывов для модерации');
    } finally {
      setLoading(false);
    }
  };

  const analyzeSentiment = async (reviewId: string) => {
    try {
      await reviewService.analyzeSentiment(reviewId);
      await loadReviews();
    } catch (error) {
      setError('Ошибка при анализе тональности отзыва');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <ErrorMessage>
        У вас нет доступа к этой странице. Требуется роль модератора или администратора.
      </ErrorMessage>
    );
  }

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <div>
      <h2>Модерация отзывов</h2>
      {reviews.map(review => (
        <ReviewCard key={review.id}>
          <ReviewHeader>
            <ReviewMeta>
              <RatingDisplay>
                <StarRating value={review.rating} readOnly />
                <span>{review.rating.toFixed(1)}</span>
              </RatingDisplay>
              <ReviewDate>
                {new Date(review.createdAt).toLocaleDateString('ru-RU')}
              </ReviewDate>
            </ReviewMeta>
          </ReviewHeader>

          <ReviewContent>
            <ReviewTitle>{review.title}</ReviewTitle>
            <p>{review.comment}</p>
          </ReviewContent>

          <ReviewActions>
            <ActionButton
              variant="success"
              onClick={() => reviewService.moderateReview(review.id, 'approved')}
            >
              Одобрить
            </ActionButton>
            <ActionButton
              variant="danger"
              onClick={() => reviewService.moderateReview(review.id, 'rejected')}
            >
              Отклонить
            </ActionButton>
            {!review.sentimentLabel && (
              <ActionButton
                onClick={() => analyzeSentiment(review.id)}
                variant="info"
              >
                Анализ тональности
              </ActionButton>
            )}
          </ReviewActions>
        </ReviewCard>
      ))}
    </div>
  );
};

export default ReviewModeration; 