import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import userService, { adminUserService } from '../../services/userService';
import { User, UserRole } from '../../types/auth';

interface PageButtonProps {
  active?: boolean;
}

interface BadgeProps {
  role: 'admin' | 'manager' | 'user';
}

interface CustomerWithDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  address?: string;
  fullName: string;
  bookingsCount: number;
  totalSpent: number;
  lastVisit: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
}

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

const Badge = styled.span<BadgeProps>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.role) {
      case 'admin':
        return '#e3f7ed';
      case 'manager':
        return '#fff8e6';
      default:
        return '#e8f0fe';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'admin':
        return '#1d8a4e';
      case 'manager':
        return '#ff9800';
      default:
        return '#3f51b5';
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

const PageButton = styled.button<PageButtonProps>`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${props => (props.active ? '#3498db' : '#e0e0e0')};
  border-radius: 4px;
  background-color: ${props => (props.active ? '#3498db' : 'white')};
  color: ${props => (props.active ? 'white' : '#2c3e50')};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => (props.active ? '#2980b9' : '#f0f0f0')};
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
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const AddButton = styled.button`
  background-color: #3498db;
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
    background-color: #2980b9;
  }

  i {
    font-size: 1.2rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

const DetailRow = styled.tr`
  background-color: #f8f9fa;
  
  td {
    padding: 1.5rem;
  }
`;

const DetailContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const DetailGroup = styled.div`
  h4 {
    font-size: 1rem;
    color: #7f8c8d;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  p {
    font-size: 1.1rem;
    color: #2c3e50;
    margin: 0;
  }
`;

const StatsCard = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1;
  min-width: 220px;

  h3 {
    font-size: 1.1rem;
    color: #7f8c8d;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 2rem;
    color: #2c3e50;
    font-weight: 600;
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #7f8c8d;

    &:hover {
      color: #2c3e50;
    }
  }
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #7f8c8d;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f9fa;
    color: #2c3e50;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

// Форматирование даты
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Получение инициалов из полного имени
const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [customersPerPage] = useState<number>(10);
  
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerWithDetails | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await adminUserService.getAllCustomers();
      
      // Преобразуем данные из API в формат, используемый в UI
      const enhancedCustomers: CustomerWithDetails[] = response.data.users.map((user: User) => ({
        ...user,
        fullName: user.name || '',
        bookingsCount: Math.floor(Math.random() * 10), // Демо-данные
        totalSpent: Math.floor(Math.random() * 100000), // Демо-данные
        lastVisit: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // Демо-данные
        joinDate: user.createdAt,
        status: 'active', // Устанавливаем значение по умолчанию
        phone: user.phone || '', // Добавляем свойство phone, если оно есть
        address: '' // Добавляем пустой адрес
      }));
      
      setCustomers(enhancedCustomers);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке клиентов:', err);
      setError('Произошла ошибка при загрузке списка клиентов');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (customer: CustomerWithDetails): void => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!customerToDelete) return;
    
    try {
      await adminUserService.deleteUser(customerToDelete.id);
      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      // Здесь можно добавить оповещение об успешном удалении
    } catch (err) {
      console.error('Ошибка при удалении клиента:', err);
      // Здесь можно добавить оповещение об ошибке
    }
  };

  const exportToCSV = (): void => {
    // Получаем текущие отфильтрованные клиенты
    const dataToExport = filteredCustomers;
    
    // Создаем заголовок CSV
    const header = [
      'ID',
      'Имя',
      'Email',
      'Телефон',
      'Бронирований',
      'Сумма покупок',
      'Последний визит',
      'Дата регистрации',
      'Статус'
    ].join(',');
    
    // Создаем строки CSV
    const rows = dataToExport.map(customer => [
      customer.id,
      customer.fullName,
      customer.email,
      customer.phone || 'Н/Д',
      customer.bookingsCount,
      `${customer.totalSpent.toLocaleString('ru-RU')} ₽`,
      formatDate(customer.lastVisit),
      formatDate(customer.joinDate),
      customer.status === 'active' ? 'Активен' : 'Неактивен'
    ].join(','));
    
    // Объединяем заголовок и строки
    const csvContent = [header, ...rows].join('\n');
    
    // Создаем blob и скачиваем
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `клиенты-экспорт-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Фильтрация клиентов
  const filteredCustomers = customers.filter(customer => {
    // Поиск по имени или email
    const searchMatch = 
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone || '').includes(searchTerm);
    
    // Фильтр по статусу
    const statusMatch = statusFilter === 'all' || customer.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Пагинация
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Функция для изменения страницы
  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Клиенты</PageTitle>
        <ButtonGroup>
          <ExportButton onClick={exportToCSV}>
            <i className="fas fa-download"></i>
            Экспорт CSV
          </ExportButton>
          <AddButton>
            <i className="fas fa-plus"></i>
            Добавить
          </AddButton>
        </ButtonGroup>
      </PageHeader>

      <StatsGrid>
        <StatsCard>
          <h3>Всего клиентов</h3>
          <p>{customers.length}</p>
        </StatsCard>
        <StatsCard>
          <h3>Активные</h3>
          <p>{customers.filter(c => c.status === 'active').length}</p>
        </StatsCard>
        <StatsCard>
          <h3>Новые в этом месяце</h3>
          <p>
            {
              customers.filter(c => {
                const now = new Date();
                const createdAt = new Date(c.createdAt);
                return (
                  createdAt.getMonth() === now.getMonth() &&
                  createdAt.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </p>
        </StatsCard>
        <StatsCard>
          <h3>Средний чек</h3>
          <p>
            {customers.length > 0
              ? `${Math.floor(
                  customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
                ).toLocaleString('ru-RU')} ₽`
              : '0 ₽'}
          </p>
        </StatsCard>
      </StatsGrid>

      <FilterContainer>
        <SearchInput>
          <input
            type="text"
            placeholder="Поиск по имени, email или телефону..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </SearchInput>

        <FilterSelect
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">Все клиенты</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </FilterSelect>
      </FilterContainer>

      {loading ? (
        <LoadingWrapper>
          <LoadingIndicator>Загрузка клиентов...</LoadingIndicator>
        </LoadingWrapper>
      ) : error ? (
        <NoResults>
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <RetryButton onClick={fetchCustomers}>Попробовать снова</RetryButton>
        </NoResults>
      ) : currentCustomers.length === 0 ? (
        <NoResults>
          <i className="fas fa-users"></i>
          <p>Клиенты не найдены. Попробуйте изменить параметры фильтрации.</p>
        </NoResults>
      ) : (
        <>
          <TableContainer>
            <CustomersTable>
              <TableHead>
                <tr>
                  <th>Клиент</th>
                  <th>Телефон</th>
                  <th>Бронирований</th>
                  <th>Сумма покупок</th>
                  <th>Последний визит</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </TableHead>
              <TableBody>
                {currentCustomers.map(customer => (
                  <React.Fragment key={customer.id}>
                    <tr>
                      <td>
                        <CustomerInfo>
                          <CustomerAvatar>
                            {getInitials(customer.fullName)}
                          </CustomerAvatar>
                          <div>
                            <CustomerName>{customer.fullName}</CustomerName>
                            <CustomerEmail>{customer.email}</CustomerEmail>
                          </div>
                        </CustomerInfo>
                      </td>
                      <td>{customer.phone || 'Не указан'}</td>
                      <td>{customer.bookingsCount}</td>
                      <td>{customer.totalSpent.toLocaleString('ru-RU')} ₽</td>
                      <td>{formatDate(customer.lastVisit)}</td>
                      <td>
                        <Badge 
                          role={customer.status === 'active' ? 'admin' : 'user' as 'admin' | 'user' | 'manager'}
                        >
                          {customer.status === 'active' ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </td>
                      <td>
                        <ActionLink to={`/admin/customers/${customer.id}`}>
                          <i className="fas fa-eye"></i>
                          Просмотр
                        </ActionLink>
                        <ActionLink 
                          to="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setExpandedCustomer(
                              expandedCustomer === customer.id ? null : customer.id
                            );
                          }}
                        >
                          <i className={`fas fa-${expandedCustomer === customer.id ? 'chevron-up' : 'chevron-down'}`}></i>
                          {expandedCustomer === customer.id ? 'Свернуть' : 'Подробнее'}
                        </ActionLink>
                      </td>
                    </tr>
                    {expandedCustomer === customer.id && (
                      <DetailRow>
                        <td colSpan={7}>
                          <DetailContent>
                            <DetailGroup>
                              <h4>ID клиента</h4>
                              <p>{customer.id}</p>
                            </DetailGroup>
                            <DetailGroup>
                              <h4>Дата регистрации</h4>
                              <p>{formatDate(customer.joinDate)}</p>
                            </DetailGroup>
                            <DetailGroup>
                              <h4>Адрес</h4>
                              <p>{customer.address || 'Не указан'}</p>
                            </DetailGroup>
                            <DetailGroup>
                              <h4>Действия</h4>
                              <div>
                                <ActionLink to={`/admin/customers/${customer.id}/edit`}>
                                  <i className="fas fa-edit"></i>
                                  Редактировать
                                </ActionLink>
                                <ActionLink 
                                  to="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteClick(customer);
                                  }}
                                  style={{ color: '#e74c3c' }}
                                >
                                  <i className="fas fa-trash"></i>
                                  Удалить
                                </ActionLink>
                              </div>
                            </DetailGroup>
                          </DetailContent>
                        </td>
                      </DetailRow>
                    )}
                  </React.Fragment>
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
                &lt;
              </PageButton>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PageButton
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </PageButton>
              ))}

              <PageButton
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </PageButton>
            </Pagination>
          )}
        </>
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>Подтверждение удаления</h2>
              <button onClick={() => setShowDeleteModal(false)}>&times;</button>
            </ModalHeader>
            <ModalBody>
              {customerToDelete && (
                <p>
                  Вы действительно хотите удалить клиента <strong>{customerToDelete.fullName}</strong>?
                  Это действие невозможно отменить.
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <CancelButton onClick={() => setShowDeleteModal(false)}>
                Отмена
              </CancelButton>
              <DeleteButton onClick={confirmDelete}>
                Удалить
              </DeleteButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default CustomersPage; 