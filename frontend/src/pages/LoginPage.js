import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PageWrapper = styled.div`
  min-height: calc(100vh - 150px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background:
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    url('https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80')
      center/cover no-repeat fixed;
`;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(to bottom, var(--primary-color), var(--accent-color));
    border-radius: var(--radius-md) 0 0 var(--radius-md);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--dark-color);
  font-family: 'Playfair Display', serif;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

const Input = styled(Field)`
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  transition: var(--transition);
  font-size: 1rem;
  width: 100%;
  background-color: var(--light-color);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.8;
  }
`;

const Error = styled.div`
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  z-index: 1;
  letter-spacing: 0.5px;
  font-size: 1rem;
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: var(--dark-color);
    transition: var(--transition);
    z-index: -1;
  }

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-3px);
  }

  &:hover::before {
    width: 100%;
  }

  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1rem;
  color: var(--text-color);

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    position: relative;
    transition: var(--transition);

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: var(--transition);
    }

    &:hover {
      color: var(--accent-color);
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

const Alert = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--error-color);
  padding: 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--error-color);
  font-size: 0.95rem;
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Некорректный email').required('Обязательное поле'),
  password: Yup.string().required('Обязательное поле'),
});

const LoginPage = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoginError('');

    const success = await login({
      email: values.email,
      password: values.password,
    });

    if (success) {
      navigate('/');
    } else {
      setLoginError(error || 'Не удалось войти. Проверьте ваши учетные данные.');
    }

    setSubmitting(false);
  };

  return (
    <PageWrapper>
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
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Введите ваш пароль"
                />
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
    </PageWrapper>
  );
};

export default LoginPage;
