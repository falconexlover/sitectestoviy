import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import './CreateReview.css';

interface CreateReviewProps {
  roomId: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  prefilledData?: {
    rating?: number;
    title?: string;
    comment?: string;
  };
}

interface FormError {
  rating?: string;
  title?: string;
  comment?: string;
}

const CreateReview: React.FC<CreateReviewProps> = ({
  roomId,
  onSubmitSuccess,
  onCancel,
  className = '',
  prefilledData = {}
}) => {
  const { user } = useAuth();
  
  // Состояние формы отзыва
  const [rating, setRating] = useState<number>(prefilledData.rating || 0);
  const [title, setTitle] = useState<string>(prefilledData.title || '');
  const [comment, setComment] = useState<string>(prefilledData.comment || '');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoURLs, setPhotoURLs] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormError>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Обновление URL'ов предпросмотра фотографий при их изменении
  useEffect(() => {
    if (photos.length > 0) {
      const newPhotoURLs = Array.from(photos).map(photo => URL.createObjectURL(photo));
      setPhotoURLs(prevURLs => {
        // Очищаем предыдущие URL'ы для высвобождения памяти
        prevURLs.forEach(url => URL.revokeObjectURL(url));
        return newPhotoURLs;
      });
    }
    
    // Очистка URL'ов при размонтировании компонента
    return () => {
      photoURLs.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photos]);

  // Обработчик изменения рейтинга
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    // Сброс ошибки при изменении поля
    if (errors.rating) {
      setErrors(prevErrors => ({ ...prevErrors, rating: undefined }));
    }
  };

  // Обработчик изменения заголовка
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // Сброс ошибки при изменении поля
    if (errors.title) {
      setErrors(prevErrors => ({ ...prevErrors, title: undefined }));
    }
  };

  // Обработчик изменения комментария
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    // Сброс ошибки при изменении поля
    if (errors.comment) {
      setErrors(prevErrors => ({ ...prevErrors, comment: undefined }));
    }
  };

  // Обработчик загрузки фотографий
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    }
  };

  // Обработчик удаления фотографии по индексу
  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, index) => index !== indexToRemove));
    setPhotoURLs(prevURLs => {
      // Освобождаем URL объекта, который удаляем
      URL.revokeObjectURL(prevURLs[indexToRemove]);
      return prevURLs.filter((_, index) => index !== indexToRemove);
    });
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: FormError = {};
    let isValid = true;

    if (rating === 0) {
      newErrors.rating = 'Пожалуйста, укажите рейтинг';
      isValid = false;
    }

    if (!title.trim()) {
      newErrors.title = 'Пожалуйста, добавьте заголовок к отзыву';
      isValid = false;
    } else if (title.trim().length < 5 || title.trim().length > 100) {
      newErrors.title = 'Заголовок должен содержать от 5 до 100 символов';
      isValid = false;
    }

    if (!comment.trim()) {
      newErrors.comment = 'Пожалуйста, напишите текст отзыва';
      isValid = false;
    } else if (comment.trim().length < 20) {
      newErrors.comment = 'Отзыв должен содержать не менее 20 символов';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка валидности формы
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Подготовка данных для отправки
      const formData = new FormData();
      formData.append('roomId', roomId);
      formData.append('userId', user?.id || '');
      formData.append('rating', rating.toString());
      formData.append('title', title);
      formData.append('comment', comment);
      
      // Добавление фотографий
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      // Имитация отправки данных на сервер
      await new Promise(resolve => setTimeout(resolve, 1500));

      // В реальном приложении здесь был бы запрос к API:
      // const response = await api.post('/reviews', formData);

      // Сброс формы после успешной отправки
      setRating(0);
      setTitle('');
      setComment('');
      setPhotos([]);
      setPhotoURLs([]);

      // Вызов колбэка успешной отправки, если он предоставлен
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`create-review ${className}`}>
      <form onSubmit={handleSubmit} className="review-form">
        <h3>Оставить отзыв</h3>
        
        <div className={`form-group ${errors.rating ? 'has-error' : ''}`}>
          <label htmlFor="rating">Общая оценка *</label>
          <div className="rating-input">
            <StarRating
              value={rating}
              onChange={handleRatingChange}
              size="large"
              readOnly={isSubmitting}
            />
          </div>
          {errors.rating && <div className="error-message">{errors.rating}</div>}
        </div>
        
        <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
          <label htmlFor="title">Заголовок отзыва *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Кратко опишите ваше впечатление"
            disabled={isSubmitting}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className={`form-group ${errors.comment ? 'has-error' : ''}`}>
          <label htmlFor="comment">Текст отзыва *</label>
          <textarea
            id="comment"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Расскажите подробнее о вашем опыте проживания"
            rows={5}
            disabled={isSubmitting}
          ></textarea>
          {errors.comment && <div className="error-message">{errors.comment}</div>}
        </div>
        
        <div className="form-group">
          <label>Фотографии</label>
          <div className="photo-upload-container">
            <label className="photo-upload-button" htmlFor="photos">
              <i className="fas fa-camera"></i>
              Добавить фото
            </label>
            <input
              type="file"
              id="photos"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              disabled={isSubmitting}
              hidden
            />
            
            {photoURLs.length > 0 && (
              <div className="photo-preview-container">
                {photoURLs.map((url, index) => (
                  <div key={index} className="photo-preview">
                    <img src={url} alt={`Превью ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-photo-button"
                      onClick={() => handleRemovePhoto(index)}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <small className="form-tip">
            Вы можете загрузить до 5 фотографий в формате JPG или PNG
          </small>
        </div>
        
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Отмена
            </button>
          )}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Отправка...
              </>
            ) : (
              'Отправить отзыв'
            )}
          </button>
        </div>
        
        <div className="form-footer">
          <p>* - обязательные поля</p>
          <p className="privacy-note">
            Отправляя отзыв, вы соглашаетесь с нашими{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              правилами публикации отзывов
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreateReview; 