import { useState, useCallback, ChangeEvent } from 'react';

/**
 * Тип для опций валидации полей формы
 */
export type ValidationRule<T = any> = {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: T) => boolean | string;
  errorMessage?: string;
};

/**
 * Тип для объекта с правилами валидации
 */
export type ValidationRules<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

/**
 * Тип для объекта с ошибками
 */
export type FormErrors<T extends Record<string, any>> = {
  [K in keyof T]?: string;
};

/**
 * Интерфейс возвращаемого объекта хука useForm
 */
export interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: FormErrors<T>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (newValues: Partial<T>) => void;
  reset: () => void;
  validateField: <K extends keyof T>(field: K) => boolean;
  validateForm: () => boolean;
}

/**
 * Хук для управления формами с валидацией
 * @param initialValues Начальные значения полей формы
 * @param validationRules Правила валидации полей
 * @returns Объект с методами и свойствами для управления формой
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(() => 
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>)
  );
  const [isDirty, setIsDirty] = useState(false);

  // Валидация отдельного поля
  const validateField = useCallback(<K extends keyof T>(field: K): boolean => {
    const value = values[field];
    const rules = validationRules[field];
    
    if (!rules) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      isValid = false;
      errorMessage = rules.errorMessage || 'Это поле обязательно';
    } else if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
      isValid = false;
      errorMessage = rules.errorMessage || `Минимальное значение: ${rules.min}`;
    } else if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
      isValid = false;
      errorMessage = rules.errorMessage || `Максимальное значение: ${rules.max}`;
    } else if (rules.minLength !== undefined && typeof value === 'string' && value.length < rules.minLength) {
      isValid = false;
      errorMessage = rules.errorMessage || `Минимальная длина: ${rules.minLength}`;
    } else if (rules.maxLength !== undefined && typeof value === 'string' && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = rules.errorMessage || `Максимальная длина: ${rules.maxLength}`;
    } else if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = rules.errorMessage || 'Некорректный формат';
    } else if (rules.validate) {
      const result = rules.validate(value);
      if (typeof result === 'string') {
        isValid = false;
        errorMessage = result;
      } else if (result === false) {
        isValid = false;
        errorMessage = rules.errorMessage || 'Некорректное значение';
      }
    }
    
    // Обновляем ошибки
    setErrors(prev => ({
      ...prev,
      [field]: isValid ? undefined : errorMessage
    }));
    
    return isValid;
  }, [values, validationRules]);

  // Валидация всей формы
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {};
    let isValid = true;
    
    // Проверяем каждое поле с правилами
    Object.keys(validationRules).forEach(key => {
      const field = key as keyof T;
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }, [validateField, validationRules]);

  // Обработчик изменения значения поля
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Обрабатываем чекбоксы отдельно
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    setIsDirty(true);
    
    // Если поле уже помечено как touched, валидируем при изменении
    if (touched[name as keyof T]) {
      validateField(name as keyof T);
    }
  }, [touched, validateField]);

  // Обработчик потери фокуса
  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name as keyof T);
  }, [validateField]);

  // Установка значения поля программно
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    setIsDirty(true);
    
    // Валидируем, если поле уже помечено как touched
    if (touched[field]) {
      validateField(field);
    }
  }, [touched, validateField]);

  // Установка нескольких значений одновременно
  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
    
    setIsDirty(true);
    
    // Валидируем поля, которые уже помечены как touched
    Object.keys(newValues).forEach(key => {
      const field = key as keyof T;
      if (touched[field]) {
        validateField(field);
      }
    });
  }, [touched, validateField]);

  // Сброс формы
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>));
    setIsDirty(false);
  }, [initialValues]);

  // Проверяем валидность всей формы
  const isValid = Object.keys(errors).length === 0 && validateForm();

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    setValue,
    setValues: setFormValues,
    reset,
    validateField,
    validateForm
  };
} 