import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #3498db;
    }
  }

  i {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #7f8c8d;
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CustomersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
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

const CustomerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  margin-right: 1rem;
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CustomerName = styled.div`
  font-weight: 500;
`;

const CustomerEmail = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.role) {
      case 'admin': return '#e3f7ed';
      case 'manager': return '#fff8e6';
      default: return '#e8f0fe';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'admin': return '#1d8a4e';
      case 'manager': return '#ff9800';
      default: return '#3f51b5';
    }
  }};
`;

const ActionLink = styled(Link)`
  display: inline-block;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: #f0f0f0;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.2s;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  i {
    margin-right: 0.25rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => props.active ? '#3498db' : '#e0e0e0'};
  border-radius: 4px;
  background-color: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#f0f0f0'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingIndicator = styled.div`
  font-size: 1.1rem;
  color: #7f8c8d;
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const CustomerStats = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: #7f8c8d;
    
    i {
      margin-right: 0.25rem;
      font-size: 0.9rem;
    }
  }
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${props => props.danger ? '#fff0f0' : '#f0f0f0'};
  color: ${props => props.danger ? '#e53935' : '#2c3e50'};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: ${props => props.danger ? '#ffebee' : '#e0e0e0'};
  }
  
  i {
    margin-right: 0.25rem;
  }
`;

const ExportButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #219653;
  }

  i {
    font-size: 1.2rem;
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const translateRole = (role) => {
  const roles = {
    'customer': 'Клиент',
    'admin': 'Администратор',
    'manager': 'Менеджер'
  };
  return roles[role] || role;
};

const getInitials = (name) => {
  if (!name) return '?';
  
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllCustomers();
      setCustomers(response.data);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке клиентов:', error);
      setError('Произошла ошибка при загрузке списка клиентов');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      await userService.deleteUser(customerToDelete.id);
      
      // Обновляем состояние после успешного удаления
      setCustomers(customers.filter(customer => customer.id !== customerToDelete.id));
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      
      // Оповещение об успешном удалении
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      // Оповещение об ошибке
    }
  };
  
  const exportToCSV = () => {
    // Функция экспорта клиентов в CSV
    const headers = ['ID', 'Имя', 'Email', 'Телефон', 'Роль', 'Бронирований', 'Дата регистрации'];
    const rows = filteredCustomers.map(customer => [
      customer.id,
      customer.name || 'Н/Д',
      customer.email,
      customer.phone || 'Н/Д',
      translateRole(customer.role),
      customer.bookingsCount || '0',
      formatDate(customer.createdAt)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Создаем временную ссылку для скачивания файла
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `customers-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };
  
  // Фильтрация клиентов
  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );
  
  // Пагинация
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Управление клиентами</PageTitle>
        <ExportButton onClick={exportToCSV}>
          <i className="fas fa-file-export"></i> Экспорт в CSV
        </ExportButton>
      </PageHeader>
      
      <FilterContainer>
        <SearchInput>
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Поиск клиента по имени, email или телефону..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
      </FilterContainer>
      
      {loading ? (
        <LoadingWrapper>
          <LoadingIndicator>Загрузка клиентов...</LoadingIndicator>
        </LoadingWrapper>
      ) : error ? (
        <NoResults>
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <RetryButton onClick={fetchCustomers}>Повторить запрос</RetryButton>
        </NoResults>
      ) : currentCustomers.length === 0 ? (
        <NoResults>
          <i className="fas fa-users"></i>
          <p>Клиенты не найдены</p>
          <RetryButton onClick={() => setSearchTerm('')}>Сбросить поиск</RetryButton>
        </NoResults>
      ) : (
        <>
          <TableContainer>
            <CustomersTable>
              <TableHead>
                <tr>
                  <th>Клиент</th>
                  <th>Контакты</th>
                  <th>Роль</th>
                  <th>Статистика</th>
                  <th>Дата регистрации</th>
                  <th>Действия</th>
                </tr>
              </TableHead>
              <TableBody>
                {currentCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td>
                      <CustomerInfo>
                        <CustomerAvatar>{getInitials(customer.name)}</CustomerAvatar>
                        <div>
                          <CustomerName>{customer.name || 'Без имени'}</CustomerName>
                          <CustomerEmail>ID: {customer.id}</CustomerEmail>
                        </div>
                      </CustomerInfo>
                    </td>
                    <td>
                      <div>{customer.email}</div>
                      <small style={{ color: '#7f8c8d' }}>{customer.phone || 'Телефон не указан'}</small>
                    </td>
                    <td>
                      <Badge role={customer.role}>{translateRole(customer.role)}</Badge>
                    </td>
                    <td>
                      <CustomerStats>
                        <span>
                          <i className="fas fa-calendar-check"></i> {customer.bookingsCount || 0} бронирований
                        </span>
                        <span>
                          <i className="fas fa-money-bill-wave"></i> {customer.totalSpent?.toLocaleString('ru-RU') || 0} ₽
                        </span>
                      </CustomerStats>
                    </td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>
                      <ActionLink to={`/admin/customers/${customer.id}`}>
                        <i className="fas fa-eye"></i> Детали
                      </ActionLink>
                      <ActionButton danger onClick={() => handleDeleteClick(customer)}>
                        <i className="fas fa-trash-alt"></i> Удалить
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </CustomersTable>
          </TableContainer>
          
          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </PageButton>
              
              {[...Array(totalPages).keys()].map(number => (
                <PageButton
                  key={number + 1}
                  active={number + 1 === currentPage}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
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
      
      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Подтверждение удаления</ModalTitle>
            <ModalText>
              Вы действительно хотите удалить клиента <strong>{customerToDelete?.name || customerToDelete?.email}</strong>?
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

export default CustomersPage; 