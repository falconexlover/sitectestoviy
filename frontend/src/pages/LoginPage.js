import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Container = styled.div`
  max-width: 400px;
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
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Некорректный email')
    .required('Обязательное поле'),
  password: Yup.string()
    .required('Обязательное поле')
});

const LoginPage = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoginError('');
    
    const success = await login({
      email: values.email,
      password: values.password
    });
    
    if (success) {
      navigate('/');
    } else {
      setLoginError(error || 'Не удалось войти. Проверьте ваши учетные данные.');
    }
    
    setSubmitting(false);
  };
  
  return (
    <Container>
      <Title>Вход в систему</Title>
      
      {loginError && <Alert>{loginError}</Alert>}
      
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" placeholder="Введите ваш email" />
              <ErrorMessage name="email" component={Error} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Пароль</Label>
              <Input type="password" id="password" name="password" placeholder="Введите ваш пароль" />
              <ErrorMessage name="password" component={Error} />
            </FormGroup>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Войти'}
            </Button>
          </StyledForm>
        )}
      </Formik>
      
      <LinkText>
        Еще нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </LinkText>
    </Container>
  );
};

export default LoginPage; 