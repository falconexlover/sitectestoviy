import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #003366;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled(Field)`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #003366;
  }
`;

const Error = styled.div`
  color: #e53935;
  font-size: 0.875rem;
`;

const Button = styled.button`
  background-color: #003366;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #002244;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  
  a {
    color: #003366;
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Alert = styled.div`
  background-color: ${({ success }) => success ? '#e8f5e9' : '#ffebee'};
  color: ${({ success }) => success ? '#2e7d32' : '#c62828'};
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .required('Обязательное поле')
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов'),
  email: Yup.string()
    .email('Некорректный email')
    .required('Обязательное поле'),
  password: Yup.string()
    .required('Обязательное поле')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: Yup.string()
    .required('Подтвердите пароль')
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
});

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [registerStatus, setRegisterStatus] = useState({
    message: '',
    success: false
  });
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setRegisterStatus({
      message: '',
      success: false
    });
    
    try {
      const success = await register({
        username: values.username,
        email: values.email,
        password: values.password
      });
      
      if (success) {
        setRegisterStatus({
          message: 'Регистрация успешна! Вы будете перенаправлены на страницу входа.',
          success: true
        });
        
        resetForm();
        
        // Перенаправляем на страницу входа через 2 секунды
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setRegisterStatus({
          message: 'Не удалось зарегистрироваться. Пожалуйста, повторите попытку.',
          success: false
        });
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setRegisterStatus({
        message: error.response?.data?.message || 'Ошибка при регистрации. Попробуйте позже.',
        success: false
      });
    }
    
    setSubmitting(false);
  };
  
  return (
    <Container>
      <Title>Регистрация</Title>
      
      {registerStatus.message && (
        <Alert success={registerStatus.success}>
          {registerStatus.message}
        </Alert>
      )}
      
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <FormGroup>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="Введите имя пользователя"
              />
              <ErrorMessage name="username" component={Error} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Введите ваш email"
              />
              <ErrorMessage name="email" component={Error} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Пароль</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Введите пароль"
              />
              <ErrorMessage name="password" component={Error} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Подтвердите пароль"
              />
              <ErrorMessage name="confirmPassword" component={Error} />
            </FormGroup>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </StyledForm>
        )}
      </Formik>
      
      <LinkText>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </LinkText>
    </Container>
  );
};

export default RegisterPage; 