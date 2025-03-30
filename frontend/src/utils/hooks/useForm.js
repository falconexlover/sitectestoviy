import { useState, useCallback, useEffect } from 'react';
import logger from '../logger';

/**
 * Хук для работы с формами и валидацией
 * 
 * @param {Object} options - Опции формы
 * @param {Object} options.initialValues - Начальные значения полей формы
 * @param {Function} options.validate - Функция валидации формы
 * @param {Function} options.onSubmit - Обработчик отправки формы
 * @param {Object} options.validationSchema - Схема валидации Yup (опционально)
 * @param {boolean} options.validateOnChange - Выполнять валидацию при изменении
 * @param {boolean} options.validateOnBlur - Выполнять валидацию при потере фокуса
 * 
 * @returns {Object} - Объект с методами и состоянием формы
 */
export const useForm = ({
  initialValues = {},
  validate,
  onSubmit,
  validationSchema,
  validateOnChange = true,
  validateOnBlur = true
}) => {
  // Состояние формы
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  
  // Функция валидации значений формы
  const validateForm = useCallback(async (formValues = values) => {
    try {
      let validationErrors = {};
      
      // Если передана функция валидации, используем ее
      if (typeof validate === 'function') {
        validationErrors = await validate(formValues);
      }
      
      // Если передана схема Yup, используем ее
      if (validationSchema) {
        try {
          await validationSchema.validate(formValues, { abortEarly: false });
        } catch (yupError) {
          if (yupError.inner) {
            yupError.inner.forEach(error => {
              validationErrors[error.path] = error.message;
            });
          }
        }
      }
      
      setErrors(validationErrors);
      return validationErrors;
    } catch (error) {
      logger.error('Ошибка при валидации формы:', error);
      return {};
    }
  }, [values, validate, validationSchema]);
  
  // Обработчик изменения значения в поле
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));
    
    if (validateOnChange) {
      validateForm({
        ...values,
        [name]: fieldValue
      });
    }
  }, [values, validateOnChange, validateForm]);
  
  // Обработчик потери фокуса полем
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    if (validateOnBlur) {
      validateForm(values);
    }
  }, [values, validateOnBlur, validateForm]);
  
  // Обработчик отправки формы
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }
    
    setSubmitCount(prevCount => prevCount + 1);
    setTouched(Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    
    const validationErrors = await validateForm();
    const isValid = Object.keys(validationErrors).length === 0;
    
    if (isValid && typeof onSubmit === 'function') {
      setIsSubmitting(true);
      try {
        await onSubmit(values, { setValues, setErrors, setTouched });
      } catch (error) {
        logger.error('Ошибка при отправке формы:', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          _form: error.message || 'Произошла ошибка при отправке формы'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);
  
  // Функция для установки значения поля
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    if (validateOnChange) {
      validateForm({
        ...values,
        [name]: value
      });
    }
  }, [values, validateOnChange, validateForm]);
  
  // Функция для установки ошибки поля
  const setFieldError = useCallback((name, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  }, []);
  
  // Функция для сброса формы
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Валидация при изменении зависимостей
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [validateForm, validationSchema]);
  
  return {
    values,
    touched,
    errors,
    isSubmitting,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    setValues,
    setErrors,
    setTouched,
    isValid: Object.keys(errors).length === 0,
    dirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    
    // Геттер для получения пропсов поля
    getFieldProps: (name) => ({
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur
    })
  };
}; 