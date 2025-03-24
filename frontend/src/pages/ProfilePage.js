import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #003366;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #003366;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: #003366;
  }
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

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  font-weight: bold;
  width: 200px;
  color: #666;
`;

const InfoValue = styled.div`
  flex: 1;
`;

const Alert = styled.div`
  background-color: ${({ success }) => success ? '#e8f5e9' : '#ffebee'};
  color: ${({ success }) => success ? '#2e7d32' : '#c62828'};
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  color: ${({ active }) => active ? '#003366' : '#666'};
  cursor: pointer;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ active }) => active ? '#003366' : 'transparent'};
  }
`;

const NoBookings = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  
  p {
    margin-bottom: 1rem;
    color: #666;
  }
  
  a {
    display: inline-block;
    background-color: #003366;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    
    &:hover {
      background-color: #002244;
    }
  }
`;

// Схема валидации для формы обновления профиля
const ProfileSchema = Yup.object().shape({
  username: Yup.string()
    .required('Обязательное поле')
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов'),
  email: Yup.string()
    .email('Некорректный email')
    .required('Обязательное поле')
});

// Схема валидации для формы изменения пароля
const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Обязательное поле'),
  newPassword: Yup.string()
    .required('Обязательное поле')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: Yup.string()
    .required('Подтвердите пароль')
    .oneOf([Yup.ref('newPassword'), null], 'Пароли должны совпадать')
});

const ProfilePage = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [status, setStatus] = useState({
    message: '',
    success: false
  });
  
  if (!user) {
    return <div>Загрузка данных пользователя...</div>;
  }
  
  const handleUpdateProfile = async (values, { setSubmitting }) => {
    setStatus({ message: '', success: false });
    
    try {
      const success = await updateProfile({
        username: values.username,
        email: values.email
      });
      
      if (success) {
        setStatus({
          message: 'Профиль успешно обновлен',
          success: true
        });
      } else {
        setStatus({
          message: 'Не удалось обновить профиль',
          success: false
        });
      }
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setStatus({
        message: error.response?.data?.message || 'Ошибка при обновлении профиля',
        success: false
      });
    }
    
    setSubmitting(false);
  };
  
  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    setStatus({ message: '', success: false });
    
    try {
      const success = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      if (success) {
        setStatus({
          message: 'Пароль успешно изменен',
          success: true
        });
        resetForm();
      } else {
        setStatus({
          message: 'Не удалось изменить пароль',
          success: false
        });
      }
    } catch (error) {
      console.error('Ошибка при изменении пароля:', error);
      setStatus({
        message: error.response?.data?.message || 'Ошибка при изменении пароля',
        success: false
      });
    }
    
    setSubmitting(false);
  };
  
  return (
    <Container>
      <Title>Личный кабинет</Title>
      
      <Tabs>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          Мой профиль
        </Tab>
        <Tab 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')}
        >
          Безопасность
        </Tab>
        <Tab 
          active={activeTab === 'bookings'} 
          onClick={() => setActiveTab('bookings')}
        >
          Мои бронирования
        </Tab>
      </Tabs>
      
      {activeTab === 'profile' && (
        <Card>
          <CardTitle>Информация о пользователе</CardTitle>
          
          {status.message && activeTab === 'profile' && (
            <Alert success={status.success}>
              {status.message}
            </Alert>
          )}
          
          <Formik
            initialValues={{
              username: user.username || '',
              email: user.email || ''
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleUpdateProfile}
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
                    placeholder="Введите email"
                  />
                  <ErrorMessage name="email" component={Error} />
                </FormGroup>
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </StyledForm>
            )}
          </Formik>
        </Card>
      )}
      
      {activeTab === 'security' && (
        <Card>
          <CardTitle>Изменить пароль</CardTitle>
          
          {status.message && activeTab === 'security' && (
            <Alert success={status.success}>
              {status.message}
            </Alert>
          )}
          
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }}
            validationSchema={PasswordSchema}
            onSubmit={handleChangePassword}
          >
            {({ isSubmitting }) => (
              <StyledForm>
                <FormGroup>
                  <Label htmlFor="currentPassword">Текущий пароль</Label>
                  <Input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="Введите текущий пароль"
                  />
                  <ErrorMessage name="currentPassword" component={Error} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="newPassword">Новый пароль</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Введите новый пароль"
                  />
                  <ErrorMessage name="newPassword" component={Error} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Подтвердите новый пароль"
                  />
                  <ErrorMessage name="confirmPassword" component={Error} />
                </FormGroup>
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Изменить пароль'}
                </Button>
              </StyledForm>
            )}
          </Formik>
        </Card>
      )}
      
      {activeTab === 'bookings' && (
        <Card>
          <CardTitle>История бронирований</CardTitle>
          
          {user.bookings && user.bookings.length > 0 ? (
            <div>
              {/* Здесь будет список бронирований */}
              <p>В разработке...</p>
            </div>
          ) : (
            <NoBookings>
              <p>У вас пока нет бронирований</p>
              <a href="/rooms">Забронировать номер</a>
            </NoBookings>
          )}
        </Card>
      )}
    </Container>
  );
};

export default ProfilePage; 