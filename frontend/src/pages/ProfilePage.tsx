import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, bookingService } from '../services/api';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { User } from '../types/auth';
import { Booking } from '../types/booking';

interface BookingStatusProps {
  status: Booking['status'];
}

interface ProfileFormValues {
  name: string;
  email: string;
  avatar?: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  color: #333;
  font-size: 32px;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AvatarContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #f0f0f0;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  color: #666;
`;

const ProfileInfo = styled.div`
  margin-bottom: 30px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #666;

  svg {
    color: #2196F3;
  }
`;

const EditButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #1976D2;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BookingList = styled.div`
  display: grid;
  gap: 20px;
`;

const BookingCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const BookingTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
`;

const BookingStatus = styled.div<BookingStatusProps>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  background: ${props => {
    switch (props.status) {
      case 'confirmed':
        return '#e3f2fd';
      case 'pending':
        return '#fff3e0';
      case 'cancelled':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return '#1976D2';
      case 'pending':
        return '#f57c00';
      case 'cancelled':
        return '#d32f2f';
      default:
        return '#666';
    }
  }};
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
`;

const BookingPrice = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #2196F3;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #1976D2;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #e0e0e0;
  }
`;

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Имя обязательно'),
  email: Yup.string().email('Некорректный формат email').required('Email обязателен'),
  avatar: Yup.string(),
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Введите текущий пароль'),
  newPassword: Yup.string()
    .required('Введите новый пароль')
    .min(8, 'Пароль должен быть не менее 8 символов')
    .matches(/[a-zA-Z]/, 'Пароль должен содержать минимум одну букву')
    .matches(/[0-9]/, 'Пароль должен содержать минимум одну цифру'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Пароли должны совпадать')
    .required('Подтвердите новый пароль'),
});

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [profileUpdateStatus, setProfileUpdateStatus] = useState<StatusMessage | null>(null);
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState<StatusMessage | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<ProfileFormValues>({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const response = await bookingService.getUserBookings();
        setBookings(response.data.bookings);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleUpdateProfile = async (values: ProfileFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setLoading(true);
      setProfileUpdateStatus(null);

      const response = await userService.updateProfile(values);
      
      setEditedProfile(values);

      setProfileUpdateStatus({
        type: 'success',
        message: 'Профиль успешно обновлен',
      });
    } catch (error: any) {
      console.error('Ошибка при обновлении профиля:', error);
      setProfileUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Не удалось обновить профиль',
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleUpdatePassword = async (values: PasswordFormValues, { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }) => {
    try {
      setLoading(true);
      setPasswordUpdateStatus(null);

      await userService.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });

      setPasswordUpdateStatus({
        type: 'success',
        message: 'Пароль успешно обновлен',
      });

      resetForm();
    } catch (error: any) {
      console.error('Ошибка при обновлении пароля:', error);
      setPasswordUpdateStatus({
        type: 'error',
        message: error.response?.data?.message || 'Не удалось обновить пароль',
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (user) {
      setEditedProfile({
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await handleUpdateProfile(editedProfile, { setSubmitting: () => {} });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      logout();
      navigate('/');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <PageTitle>Личный кабинет</PageTitle>

      <ProfileGrid>
        <ProfileCard>
          <AvatarContainer>
            <Avatar>
              <FaUser />
            </Avatar>
            <h2>{editedProfile.name}</h2>
          </AvatarContainer>

          <ProfileInfo>
            <InfoItem>
              <FaEnvelope />
              <span>{editedProfile.email}</span>
            </InfoItem>
          </ProfileInfo>

          {!isEditing ? (
            <EditButton onClick={handleEdit}>
              <FaEdit />
              Редактировать профиль
            </EditButton>
          ) : (
            <div>
              <FormGroup>
                <Label>Имя</Label>
                <Input
                  type="text"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <ButtonGroup>
                <SaveButton onClick={handleSave}>
                  <FaSave />
                  Сохранить
                </SaveButton>
                <CancelButton onClick={handleCancel}>
                  <FaTimes />
                  Отмена
                </CancelButton>
              </ButtonGroup>
            </div>
          )}
        </ProfileCard>

        <MainContent>
          <Section>
            <SectionTitle>История бронирований</SectionTitle>
            <BookingList>
              {bookings.map(booking => (
                <BookingCard key={booking.id}>
                  <BookingHeader>
                    <BookingTitle>Номер {booking.roomId}</BookingTitle>
                    <BookingStatus status={booking.status}>
                      {booking.status === 'confirmed' && 'Подтверждено'}
                      {booking.status === 'pending' && 'Ожидает подтверждения'}
                      {booking.status === 'cancelled' && 'Отменено'}
                    </BookingStatus>
                  </BookingHeader>
                  <BookingDetails>
                    <DetailItem>
                      <FaCalendarAlt />
                      Заезд: {new Date(booking.startDate).toLocaleDateString('ru-RU')}
                    </DetailItem>
                    <DetailItem>
                      <FaCalendarAlt />
                      Выезд: {new Date(booking.endDate).toLocaleDateString('ru-RU')}
                    </DetailItem>
                  </BookingDetails>
                  <BookingPrice>
                    {booking.totalPrice?.toLocaleString()} ₽
                  </BookingPrice>
                </BookingCard>
              ))}
            </BookingList>
          </Section>
        </MainContent>
      </ProfileGrid>
    </PageContainer>
  );
};

export default ProfilePage;
