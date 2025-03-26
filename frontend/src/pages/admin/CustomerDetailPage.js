import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import userService from '../../services/userService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  background-color: #f0f0f0;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }

  i {
    margin-right: 0.5rem;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  background-color: #3498db;
  color: white;
  padding: 2rem;
  text-align: center;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 3rem;
  margin: 0 auto 1rem;
`;

const ProfileName = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
`;

const ProfileRole = styled.div`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ProfileDetails = styled.div`
  padding: 1.5rem;
`;

const DetailGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  color: #2c3e50;
`;

const SectionTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: ${props => (props.danger ? '#fff0f0' : '#f0f0f0')};
  color: ${props => (props.danger ? '#e53935' : '#2c3e50')};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => (props.danger ? '#ffebee' : '#e0e0e0')};
  }

  i {
    font-size: 1rem;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingIndicator = styled.div`
  font-size: 1.1rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  i {
    font-size: 3rem;
    color: #e74c3c;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: #7f8c8d;
    margin-bottom: 1.5rem;
  }
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  i {
    font-size: 2rem;
    color: #3498db;
    margin-bottom: 1rem;
  }
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const BookingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #e0e0e0;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 1rem;
    color: #2c3e50;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return '#e3f7ed';
      case 'completed':
        return '#e8f0fe';
      case 'cancelled':
        return '#ffebee';
      case 'pending':
        return '#fff8e6';
      default:
        return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return '#1d8a4e';
      case 'completed':
        return '#3f51b5';
      case 'cancelled':
        return '#e53935';
      case 'pending':
        return '#ff9800';
      default:
        return '#7f8c8d';
    }
  }};
`;

const ViewButton = styled(Link)`
  display: inline-block;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: #f0f0f0;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }

  i {
    margin-right: 0.25rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const ModalTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 1rem;
`;

const ModalText = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #f0f0f0;
  color: #2c3e50;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ConfirmButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #e53935;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c62828;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${props => (props.active ? '#3498db' : 'transparent')};
  color: ${props => (props.active ? '#3498db' : '#7f8c8d')};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3498db;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  i {
    font-size: 3rem;
    color: #95a5a6;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    color: #7f8c8d;
  }
`;

const formatDate = dateString => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatCurrency = amount => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const translateRole = role => {
  const roles = {
    customer: 'Клиент',
    admin: 'Администратор',
    manager: 'Менеджер',
  };
  return roles[role] || role;
};

const translateStatus = status => {
  const statuses = {
    pending: 'Ожидает подтверждения',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
    completed: 'Завершено',
  };
  return statuses[status] || status;
};

const getInitials = name => {
  if (!name) return '?';

  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

  return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
};

const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statistics] = useState({
    totalBookings: 0,
    totalSpent: 0,
    averageStay: 0,
    completedBookings: 0,
  });

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getCustomerById(id);
      setCustomer(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(id);
      // Перенаправление на страницу со списком клиентов
      window.location.href = '/admin/customers';
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      // Оповещение об ошибке
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Данные клиента</PageTitle>
          <BackButton to="/admin/customers">
            <i className="fas fa-arrow-left"></i> Назад к списку
          </BackButton>
        </PageHeader>
        <LoadingWrapper>
          <LoadingIndicator>Загрузка данных клиента...</LoadingIndicator>
        </LoadingWrapper>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Данные клиента</PageTitle>
          <BackButton to="/admin/customers">
            <i className="fas fa-arrow-left"></i> Назад к списку
          </BackButton>
        </PageHeader>
        <ErrorMessage>
          <i className="fas fa-exclamation-circle"></i>
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <RetryButton onClick={fetchCustomerData}>Повторить запрос</RetryButton>
        </ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Данные клиента</PageTitle>
        <BackButton to="/admin/customers">
          <i className="fas fa-arrow-left"></i> Назад к списку
        </BackButton>
      </PageHeader>

      <ContentWrapper>
        <div>
          <ProfileCard>
            <ProfileHeader>
              <ProfileAvatar>{getInitials(customer?.name)}</ProfileAvatar>
              <ProfileName>{customer?.name || 'Без имени'}</ProfileName>
              <div>{customer?.email}</div>
              <ProfileRole>{translateRole(customer?.role)}</ProfileRole>
            </ProfileHeader>

            <ProfileDetails>
              <DetailGroup>
                <DetailLabel>Идентификатор</DetailLabel>
                <DetailValue>{customer?.id}</DetailValue>
              </DetailGroup>

              <DetailGroup>
                <DetailLabel>Телефон</DetailLabel>
                <DetailValue>{customer?.phone || 'Не указан'}</DetailValue>
              </DetailGroup>

              <DetailGroup>
                <DetailLabel>Дата регистрации</DetailLabel>
                <DetailValue>{formatDate(customer?.createdAt)}</DetailValue>
              </DetailGroup>

              <DetailGroup>
                <DetailLabel>Последняя активность</DetailLabel>
                <DetailValue>
                  {customer?.lastLogin ? formatDate(customer.lastLogin) : 'Н/Д'}
                </DetailValue>
              </DetailGroup>

              <DetailGroup>
                <DetailLabel>Адрес</DetailLabel>
                <DetailValue>{customer?.address || 'Не указан'}</DetailValue>
              </DetailGroup>

              <ActionButtons>
                <ActionButton>
                  <i className="fas fa-pencil-alt"></i> Редактировать
                </ActionButton>
                <ActionButton danger onClick={handleDeleteClick}>
                  <i className="fas fa-trash-alt"></i> Удалить
                </ActionButton>
              </ActionButtons>
            </ProfileDetails>
          </ProfileCard>
        </div>

        <div>
          <SectionTitle>Статистика</SectionTitle>
          <StatsGrid>
            <StatCard>
              <i className="fas fa-calendar-check"></i>
              <StatValue>{statistics.totalBookings}</StatValue>
              <StatLabel>Всего бронирований</StatLabel>
            </StatCard>

            <StatCard>
              <i className="fas fa-money-bill-wave"></i>
              <StatValue>{formatCurrency(statistics.totalSpent)}</StatValue>
              <StatLabel>Потрачено всего</StatLabel>
            </StatCard>

            <StatCard>
              <i className="fas fa-bed"></i>
              <StatValue>
                {statistics.averageStay}{' '}
                {statistics.averageStay === 1
                  ? 'день'
                  : statistics.averageStay > 1 && statistics.averageStay < 5
                    ? 'дня'
                    : 'дней'}
              </StatValue>
              <StatLabel>Средняя продолжительность</StatLabel>
            </StatCard>

            <StatCard>
              <i className="fas fa-check-circle"></i>
              <StatValue>{statistics.completedBookings}</StatValue>
              <StatLabel>Завершенных бронирований</StatLabel>
            </StatCard>
          </StatsGrid>

          <Tabs>
            <Tab active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>
              Бронирования
            </Tab>
            <Tab active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
              История активности
            </Tab>
            <Tab active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
              Заметки
            </Tab>
          </Tabs>

          {activeTab === 'bookings' && (
            <>
              {bookings.length === 0 ? (
                <NoDataMessage>
                  <i className="fas fa-calendar-times"></i>
                  <p>У клиента пока нет бронирований</p>
                </NoDataMessage>
              ) : (
                <BookingsTable>
                  <TableHead>
                    <tr>
                      <th>№ бронирования</th>
                      <th>Даты</th>
                      <th>Номер</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>#{booking.bookingNumber}</td>
                        <td>
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </td>
                        <td>{booking.room?.name || `№${booking.roomId}`}</td>
                        <td>{formatCurrency(booking.totalAmount)}</td>
                        <td>
                          <StatusBadge status={booking.status}>
                            {translateStatus(booking.status)}
                          </StatusBadge>
                        </td>
                        <td>
                          <ViewButton to={`/admin/bookings/${booking.id}`}>
                            <i className="fas fa-eye"></i> Детали
                          </ViewButton>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </BookingsTable>
              )}
            </>
          )}

          {activeTab === 'activity' && (
            <NoDataMessage>
              <i className="fas fa-history"></i>
              <p>История активности пока недоступна</p>
            </NoDataMessage>
          )}

          {activeTab === 'notes' && (
            <NoDataMessage>
              <i className="fas fa-sticky-note"></i>
              <p>Заметки пока не добавлены</p>
            </NoDataMessage>
          )}
        </div>
      </ContentWrapper>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Подтверждение удаления</ModalTitle>
            <ModalText>
              Вы действительно хотите удалить клиента{' '}
              <strong>{customer?.name || customer?.email}</strong>?
              <br />
              Все данные пользователя, включая историю бронирований, будут удалены.
              <br />
              Это действие нельзя отменить.
            </ModalText>
            <ModalActions>
              <CancelButton onClick={() => setShowDeleteModal(false)}>Отмена</CancelButton>
              <ConfirmButton onClick={confirmDelete}>Удалить</ConfirmButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default CustomerDetailPage;
