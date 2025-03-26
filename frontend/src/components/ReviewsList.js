import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

const ReviewsContainer = styled.div`
  margin: 3rem 0;
`;

const ReviewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ReviewsSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  span {
    font-size: 1.1rem;
    color: var(--text-muted);
  }
`;

const AddReviewButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);

  &:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: var(--light-color);
    color: var(--text-muted);
    cursor: not-allowed;
    transform: none;
  }
`;

const RatingDistribution = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.5rem 0;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  span {
    min-width: 1.5rem;
    text-align: center;
  }
`;

const RatingBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: var(--light-color);
  border-radius: 4px;
  overflow: hidden;

  div {
    height: 100%;
    background-color: var(--primary-color);
    width: ${props => props.percentage}%;
  }
`;

const RatingCount = styled.span`
  color: var(--text-muted);
  font-size: 0.9rem;
`;

const ReviewItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ReviewItem = styled.div`
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  background-color: white;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ReviewerName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const ReviewDate = styled.div`
  color: var(--text-muted);
  font-size: 0.9rem;
`;

const ReviewContent = styled.div`
  margin: 1rem 0;
  line-height: 1.6;
`;

const ReviewCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span:first-child {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  div {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const ReviewsFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: ${props => (props.active ? 'var(--primary-color)' : 'white')};
  color: ${props => (props.active ? 'white' : 'var(--text-color)')};
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: ${props => (props.active ? 'var(--primary-color)' : 'var(--light-color)')};
  }
`;

const ReviewResponse = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--light-color);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--accent-color);

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: var(--primary-color);
  }

  p {
    margin: 0;
    font-style: italic;
  }
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: var(--light-color);
  border-radius: var(--radius-md);

  h3 {
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: ${props => (props.active ? 'var(--primary-color)' : 'white')};
  color: ${props => (props.active ? 'white' : 'var(--text-color)')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: ${props => (props.active ? 'var(--primary-color)' : 'var(--light-color)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const formatDate = dateString => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const getInitials = name => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const ReviewsList = ({ reviews, stats, roomId, loading, onAddReview }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');

  const itemsPerPage = 5;

  // Фильтруем отзывы
  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'positive') return review.rating >= 4;
    if (filter === 'neutral') return review.rating === 3;
    if (filter === 'negative') return review.rating <= 2;
    return true;
  });

  // Вычисляем текущие отзывы для страницы
  const indexOfLastReview = currentPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  // Вычисляем количество страниц
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Смена страницы
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Проверяем, оставил ли уже пользователь отзыв
  const userHasReviewed = reviews.some(review => user && review.User && review.User.id === user.id);

  // Генерируем номера страниц
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <ReviewsContainer>
      <ReviewsHeader>
        <ReviewsSummary>
          <h2>Отзывы клиентов</h2>
          <span>
            <StarRating value={stats.averageRating} readOnly />
            {stats.averageRating.toFixed(1)} ({stats.totalReviews})
          </span>
        </ReviewsSummary>

        <AddReviewButton
          onClick={onAddReview}
          disabled={!isAuthenticated || userHasReviewed || loading}
        >
          <i className="fas fa-pen"></i>
          {userHasReviewed ? 'Вы уже оставили отзыв' : 'Написать отзыв'}
        </AddReviewButton>
      </ReviewsHeader>

      {stats.totalReviews > 0 && (
        <RatingDistribution>
          {[5, 4, 3, 2, 1].map(rating => (
            <RatingRow key={rating}>
              <span>{rating}</span>
              <RatingBar percentage={(stats.ratingDistribution[rating] / stats.totalReviews) * 100}>
                <div></div>
              </RatingBar>
              <RatingCount>{stats.ratingDistribution[rating]}</RatingCount>
            </RatingRow>
          ))}
        </RatingDistribution>
      )}

      {stats.categoryRatings && (
        <ReviewCategories>
          <CategoryItem>
            <span>Чистота</span>
            <div>
              <StarRating value={stats.categoryRatings.cleanliness} readOnly size="small" />
              <span>{stats.categoryRatings.cleanliness.toFixed(1)}</span>
            </div>
          </CategoryItem>
          <CategoryItem>
            <span>Сервис</span>
            <div>
              <StarRating value={stats.categoryRatings.service} readOnly size="small" />
              <span>{stats.categoryRatings.service.toFixed(1)}</span>
            </div>
          </CategoryItem>
          <CategoryItem>
            <span>Комфорт</span>
            <div>
              <StarRating value={stats.categoryRatings.comfort} readOnly size="small" />
              <span>{stats.categoryRatings.comfort.toFixed(1)}</span>
            </div>
          </CategoryItem>
          <CategoryItem>
            <span>Местоположение</span>
            <div>
              <StarRating value={stats.categoryRatings.location} readOnly size="small" />
              <span>{stats.categoryRatings.location.toFixed(1)}</span>
            </div>
          </CategoryItem>
          <CategoryItem>
            <span>Цена/качество</span>
            <div>
              <StarRating value={stats.categoryRatings.value} readOnly size="small" />
              <span>{stats.categoryRatings.value.toFixed(1)}</span>
            </div>
          </CategoryItem>
        </ReviewCategories>
      )}

      {reviews.length > 0 && (
        <ReviewsFilter>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            Все отзывы
          </FilterButton>
          <FilterButton active={filter === 'positive'} onClick={() => setFilter('positive')}>
            Положительные
          </FilterButton>
          <FilterButton active={filter === 'neutral'} onClick={() => setFilter('neutral')}>
            Нейтральные
          </FilterButton>
          <FilterButton active={filter === 'negative'} onClick={() => setFilter('negative')}>
            Отрицательные
          </FilterButton>
        </ReviewsFilter>
      )}

      {loading ? (
        <div>Загрузка отзывов...</div>
      ) : reviews.length === 0 ? (
        <NoReviews>
          <h3>Еще нет отзывов</h3>
          <p>Будьте первым, кто оставит отзыв об этом номере!</p>
          <AddReviewButton onClick={onAddReview} disabled={!isAuthenticated || userHasReviewed}>
            <i className="fas fa-pen"></i>
            Написать отзыв
          </AddReviewButton>
        </NoReviews>
      ) : (
        <>
          <ReviewItemsList>
            {currentReviews.map(review => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <ReviewerInfo>
                    <Avatar>{getInitials(review.User?.firstName || review.User?.username)}</Avatar>
                    <div>
                      <ReviewerName>
                        {review.User?.firstName
                          ? `${review.User.firstName} ${review.User.lastName || ''}`
                          : review.User?.username || 'Гость'}
                      </ReviewerName>
                      <ReviewDate>{formatDate(review.createdAt)}</ReviewDate>
                    </div>
                  </ReviewerInfo>
                  <StarRating value={review.rating} readOnly />
                </ReviewHeader>

                <ReviewContent>{review.comment}</ReviewContent>

                {review.pros && (
                  <div>
                    <strong>Достоинства:</strong> {review.pros}
                  </div>
                )}

                {review.cons && (
                  <div>
                    <strong>Недостатки:</strong> {review.cons}
                  </div>
                )}

                {review.cleanlinessRating && (
                  <ReviewCategories>
                    <CategoryItem>
                      <span>Чистота</span>
                      <div>
                        <StarRating value={review.cleanlinessRating} readOnly size="small" />
                      </div>
                    </CategoryItem>
                    <CategoryItem>
                      <span>Сервис</span>
                      <div>
                        <StarRating value={review.serviceRating} readOnly size="small" />
                      </div>
                    </CategoryItem>
                    <CategoryItem>
                      <span>Комфорт</span>
                      <div>
                        <StarRating value={review.comfortRating} readOnly size="small" />
                      </div>
                    </CategoryItem>
                    <CategoryItem>
                      <span>Местоположение</span>
                      <div>
                        <StarRating value={review.locationRating} readOnly size="small" />
                      </div>
                    </CategoryItem>
                    <CategoryItem>
                      <span>Цена/качество</span>
                      <div>
                        <StarRating value={review.valueRating} readOnly size="small" />
                      </div>
                    </CategoryItem>
                  </ReviewCategories>
                )}

                {review.response && (
                  <ReviewResponse>
                    <h4>Ответ администрации:</h4>
                    <p>{review.response}</p>
                    <ReviewDate>{formatDate(review.responseDate)}</ReviewDate>
                  </ReviewResponse>
                )}
              </ReviewItem>
            ))}
          </ReviewItemsList>

          {totalPages > 1 && (
            <Pagination>
              <PageButton onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                <i className="fas fa-chevron-left"></i>
              </PageButton>

              {pageNumbers.map(number => (
                <PageButton
                  key={number}
                  active={currentPage === number}
                  onClick={() => paginate(number)}
                >
                  {number}
                </PageButton>
              ))}

              <PageButton
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </ReviewsContainer>
  );
};

ReviewsList.propTypes = {
  reviews: PropTypes.array.isRequired,
  stats: PropTypes.shape({
    totalReviews: PropTypes.number.isRequired,
    averageRating: PropTypes.number.isRequired,
    ratingDistribution: PropTypes.object.isRequired,
    categoryRatings: PropTypes.object,
  }).isRequired,
  roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  loading: PropTypes.bool,
  onAddReview: PropTypes.func.isRequired,
};

ReviewsList.defaultProps = {
  loading: false,
};

export default ReviewsList;
