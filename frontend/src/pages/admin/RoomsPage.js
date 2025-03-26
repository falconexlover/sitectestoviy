import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import roomService from '../../services/roomService';

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

const ActionButton = styled.button`
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

const RoomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const RoomImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const RoomImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  ${RoomCard}:hover & {
    transform: scale(1.05);
  }
`;

const RoomStatus = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => (props.active ? '#e3f7ed' : '#ffebee')};
  color: ${props => (props.active ? '#1d8a4e' : '#e53935')};
`;

const RoomContent = styled.div`
  padding: 1.5rem;
`;

const RoomTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem;
`;

const RoomType = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0 0 1rem;
`;

const RoomDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const RoomFeature = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #2c3e50;

  i {
    color: #7f8c8d;
  }
`;

const RoomPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const Price = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
`;

const PriceUnit = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const RoomActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const EditButton = styled.button`
  flex: 1;
  padding: 0.6rem 0;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: #f0f0f0;
  color: #2c3e50;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background-color: #e0e0e0;
  }

  i {
    font-size: 1rem;
  }
`;

const DeleteButton = styled(EditButton)`
  background-color: #fff0f0;
  color: #e53935;

  &:hover {
    background-color: #ffebee;
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

const ModalOverlay = styled.div`
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
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #7f8c8d;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #2c3e50;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #3498db;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    width: 18px;
    height: 18px;
  }

  label {
    font-size: 0.9rem;
    color: #2c3e50;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #27ae60;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #219653;
  }
`;

const DeleteConfirmModal = styled(ModalContent)`
  max-width: 400px;
  text-align: center;
`;

const ConfirmText = styled.p`
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const ConfirmButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ConfirmCancelButton = styled(CancelButton)``;

const ConfirmDeleteButton = styled.button`
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

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' или 'edit'
  const [currentRoom, setCurrentRoom] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  // Состояние формы для добавления/редактирования номера
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    type: 'standard',
    price: '',
    capacity: '',
    beds: '',
    bathrooms: '',
    area: '',
    description: '',
    amenities: [],
    images: '',
    isActive: true,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAllRooms();
      setRooms(response.data);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке номеров:', error);
      setError('Произошла ошибка при загрузке списка номеров');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setModalMode('add');
    setFormData({
      number: '',
      title: '',
      type: 'standard',
      price: '',
      capacity: '',
      beds: '',
      bathrooms: '',
      area: '',
      description: '',
      amenities: [],
      images: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditRoom = room => {
    setModalMode('edit');
    setCurrentRoom(room);
    setFormData({
      number: room.number || '',
      title: room.title || '',
      type: room.type || 'standard',
      price: room.price || '',
      capacity: room.capacity || '',
      beds: room.beds || '',
      bathrooms: room.bathrooms || '',
      area: room.area || '',
      description: room.description || '',
      amenities: room.amenities || [],
      images: room.images?.join(',') || '',
      isActive: room.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleDeleteRoom = room => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRoom = async () => {
    try {
      await roomService.deleteRoom(roomToDelete.id);
      setRooms(rooms.filter(room => room.id !== roomToDelete.id));
      setShowDeleteConfirm(false);
      setRoomToDelete(null);
      // Оповещение об успешном удалении
    } catch (error) {
      console.error('Ошибка при удалении номера:', error);
      // Оповещение об ошибке
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAmenitiesChange = e => {
    const { value, checked } = e.target;
    let newAmenities = [...formData.amenities];

    if (checked) {
      newAmenities.push(value);
    } else {
      newAmenities = newAmenities.filter(amenity => amenity !== value);
    }

    setFormData({
      ...formData,
      amenities: newAmenities,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        beds: parseInt(formData.beds),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        images: formData.images
          .split(',')
          .map(url => url.trim())
          .filter(url => url),
      };

      if (modalMode === 'add') {
        const response = await roomService.createRoom(roomData);
        setRooms([...rooms, response.data]);
      } else {
        const response = await roomService.updateRoom(currentRoom.id, roomData);
        setRooms(rooms.map(room => (room.id === currentRoom.id ? response.data : room)));
      }

      setShowModal(false);
      // Оповещение об успешном добавлении/редактировании
    } catch (error) {
      console.error(
        `Ошибка при ${modalMode === 'add' ? 'добавлении' : 'редактировании'} номера:`,
        error
      );
      // Оповещение об ошибке
    }
  };

  // Фильтрация номеров
  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.number.toString().includes(searchTerm) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter ? room.type === typeFilter : true;
    const matchesStatus =
      statusFilter === 'active'
        ? room.isActive
        : statusFilter === 'inactive'
          ? !room.isActive
          : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Пагинация
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const roomTypes = [
    { value: 'standard', label: 'Стандартный' },
    { value: 'deluxe', label: 'Делюкс' },
    { value: 'suite', label: 'Люкс' },
    { value: 'family', label: 'Семейный' },
    { value: 'business', label: 'Бизнес' },
  ];

  const amenitiesList = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'tv', label: 'Телевизор' },
    { value: 'airConditioning', label: 'Кондиционер' },
    { value: 'minibar', label: 'Мини-бар' },
    { value: 'safeBox', label: 'Сейф' },
    { value: 'bathtub', label: 'Ванна' },
    { value: 'balcony', label: 'Балкон' },
    { value: 'kitchen', label: 'Кухня' },
    { value: 'workspace', label: 'Рабочее место' },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Управление номерами</PageTitle>
        <ActionButton onClick={handleAddRoom}>
          <i className="fas fa-plus"></i> Добавить номер
        </ActionButton>
      </PageHeader>

      <FilterContainer>
        <SearchInput>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Поиск номера..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterSelect value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">Все типы</option>
          {roomTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </FilterSelect>
      </FilterContainer>

      {loading ? (
        <LoadingWrapper>
          <LoadingIndicator>Загрузка номеров...</LoadingIndicator>
        </LoadingWrapper>
      ) : error ? (
        <NoResults>
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <RetryButton onClick={fetchRooms}>Повторить запрос</RetryButton>
        </NoResults>
      ) : currentRooms.length === 0 ? (
        <NoResults>
          <i className="fas fa-hotel"></i>
          <p>Номера не найдены</p>
          <RetryButton
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('');
              setStatusFilter('');
            }}
          >
            Сбросить фильтры
          </RetryButton>
        </NoResults>
      ) : (
        <>
          <RoomsGrid>
            {currentRooms.map(room => (
              <RoomCard key={room.id}>
                <RoomImageContainer>
                  <RoomImage
                    src={
                      room.images?.[0] || 'https://via.placeholder.com/400x200?text=Нет+изображения'
                    }
                    alt={room.title}
                  />
                  <RoomStatus active={room.isActive}>
                    {room.isActive ? 'Активен' : 'Неактивен'}
                  </RoomStatus>
                </RoomImageContainer>
                <RoomContent>
                  <RoomTitle>{room.title}</RoomTitle>
                  <RoomType>
                    {roomTypes.find(type => type.value === room.type)?.label || room.type} | Номер{' '}
                    {room.number}
                  </RoomType>
                  <RoomDetails>
                    <RoomFeature>
                      <i className="fas fa-user"></i> {room.capacity} гостей
                    </RoomFeature>
                    <RoomFeature>
                      <i className="fas fa-bed"></i> {room.beds} кроватей
                    </RoomFeature>
                    <RoomFeature>
                      <i className="fas fa-bath"></i> {room.bathrooms} ванных
                    </RoomFeature>
                    <RoomFeature>
                      <i className="fas fa-ruler-combined"></i> {room.area} м²
                    </RoomFeature>
                  </RoomDetails>
                  <RoomPrice>
                    <div>
                      <Price>{room.price.toLocaleString('ru-RU')} ₽</Price>
                      <PriceUnit> / ночь</PriceUnit>
                    </div>
                  </RoomPrice>
                  <RoomActions>
                    <EditButton onClick={() => handleEditRoom(room)}>
                      <i className="fas fa-edit"></i> Редактировать
                    </EditButton>
                    <DeleteButton onClick={() => handleDeleteRoom(room)}>
                      <i className="fas fa-trash-alt"></i> Удалить
                    </DeleteButton>
                  </RoomActions>
                </RoomContent>
              </RoomCard>
            ))}
          </RoomsGrid>

          {totalPages > 1 && (
            <Pagination>
              <PageButton onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
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

      {/* Модальное окно для добавления/редактирования номера */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {modalMode === 'add' ? 'Добавление номера' : 'Редактирование номера'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="number">Номер комнаты</Label>
                  <Input
                    type="text"
                    id="number"
                    name="number"
                    required
                    value={formData.number}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="type">Тип номера</Label>
                  <Select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {roomTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="title">Название номера</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="price">Цена за ночь (₽)</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="100"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="capacity">Вместимость (гостей)</Label>
                  <Input
                    type="number"
                    id="capacity"
                    name="capacity"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="beds">Количество кроватей</Label>
                  <Input
                    type="number"
                    id="beds"
                    name="beds"
                    required
                    min="1"
                    value={formData.beds}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="bathrooms">Количество ванных</Label>
                  <Input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    required
                    min="1"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="area">Площадь (м²)</Label>
                  <Input
                    type="number"
                    id="area"
                    name="area"
                    required
                    min="1"
                    value={formData.area}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Удобства</Label>
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}
                >
                  {amenitiesList.map(amenity => (
                    <Checkbox key={amenity.value}>
                      <input
                        type="checkbox"
                        id={`amenity-${amenity.value}`}
                        name="amenities"
                        value={amenity.value}
                        checked={formData.amenities.includes(amenity.value)}
                        onChange={handleAmenitiesChange}
                      />
                      <label htmlFor={`amenity-${amenity.value}`}>{amenity.label}</label>
                    </Checkbox>
                  ))}
                </div>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="images">Изображения (URL, через запятую)</Label>
                <Textarea
                  id="images"
                  name="images"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  value={formData.images}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <Checkbox>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <label htmlFor="isActive">Активный номер (доступен для бронирования)</label>
              </Checkbox>

              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowModal(false)}>
                  Отмена
                </CancelButton>
                <SubmitButton type="submit">
                  {modalMode === 'add' ? 'Добавить номер' : 'Сохранить изменения'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <ModalOverlay onClick={() => setShowDeleteConfirm(false)}>
          <DeleteConfirmModal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Подтверждение</ModalTitle>
              <CloseButton onClick={() => setShowDeleteConfirm(false)}>×</CloseButton>
            </ModalHeader>

            <ConfirmText>
              Вы уверены, что хотите удалить номер <strong>{roomToDelete?.title}</strong>?
              <br />
              Это действие нельзя отменить.
            </ConfirmText>

            <ConfirmButtons>
              <ConfirmCancelButton onClick={() => setShowDeleteConfirm(false)}>
                Отмена
              </ConfirmCancelButton>
              <ConfirmDeleteButton onClick={confirmDeleteRoom}>Удалить</ConfirmDeleteButton>
            </ConfirmButtons>
          </DeleteConfirmModal>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default RoomsPage;
