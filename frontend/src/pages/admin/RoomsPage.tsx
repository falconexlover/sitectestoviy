import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/api';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  ActionButton,
  FilterContainer,
  SearchInput,
  FilterSelect,
  RoomsGrid,
  Pagination,
  PageButton,
  LoadingWrapper,
  LoadingIndicator,
  NoResults,
  RetryButton,
} from '../../components/admin/rooms/RoomStyles';
import RoomCard from '../../components/admin/rooms/RoomCard';
import RoomForm from '../../components/admin/rooms/RoomForm';
import DeleteConfirmation from '../../components/admin/rooms/DeleteConfirmation';
import {
  Room,
  RoomFormData,
  roomTypes,
  mapApiRoomToRoom,
  mapRoomToApiRoom,
} from '../../components/admin/rooms/types';
import { RoomData } from '../../types/services';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const roomsPerPage = 6;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Состояние формы для добавления/редактирования номера
  const [formData, setFormData] = useState<RoomFormData>({
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

  const fetchRooms = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await roomService.getRooms();
      // Преобразование данных из API в формат, используемый в компоненте
      const mappedRooms = response.data.rooms.map(apiRoom => mapApiRoomToRoom(apiRoom));
      setRooms(mappedRooms);
      setError(null);
    } catch (error) {
      console.error('Ошибка при загрузке номеров:', error);
      setError('Произошла ошибка при загрузке списка номеров');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = (): void => {
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

  const handleEditRoom = (room: Room): void => {
    setModalMode('edit');
    setCurrentRoom(room);
    setFormData({
      number: room.number || '',
      title: room.title || '',
      type: room.type || 'standard',
      price: room.price?.toString() || '',
      capacity: room.capacity?.toString() || '',
      beds: room.beds?.toString() || '',
      bathrooms: room.bathrooms?.toString() || '',
      area: room.area?.toString() || '',
      description: room.description || '',
      amenities: room.amenities || [],
      images: room.images?.join(',') || '',
      isActive: room.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleDeleteRoom = (room: Room): void => {
    setRoomToDelete(room);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRoom = async (): Promise<void> => {
    if (!roomToDelete) return;
    
    try {
      await roomService.deleteRoom(roomToDelete.id);
      setRooms(rooms.filter(room => room.id !== roomToDelete.id));
      setShowDeleteConfirm(false);
      setRoomToDelete(null);
      // Здесь можно добавить оповещение об успешном удалении
    } catch (error) {
      console.error('Ошибка при удалении номера:', error);
      // Здесь можно добавить оповещение об ошибке
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

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

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      // Подготовка данных комнаты в соответствии с требуемым форматом API
      const roomData: RoomData = {
        name: formData.title,
        type: formData.type as 'standard' | 'deluxe' | 'suite' | 'family',
        description: formData.description,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        size: parseInt(formData.area), // Используем area как size для API
        amenities: formData.amenities,
        images: formData.images
          .split(',')
          .map(url => url.trim())
          .filter(url => url),
      };

      // Дополнительные поля, не входящие в базовый тип RoomData
      const additionalFields = {
        number: formData.number,
        beds: formData.beds,
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        isActive: formData.isActive,
        // Обеспечиваем обязательное значение для всех полей
        roomType: formData.type as 'standard' | 'deluxe' | 'suite' | 'family',
      };

      if (modalMode === 'add') {
        const response = await roomService.createRoom({
          ...roomData,
          ...additionalFields
        });
        const newRoom = mapApiRoomToRoom(response.data.room);
        setRooms([...rooms, newRoom]);
      } else if (currentRoom) {
        const response = await roomService.updateRoom(currentRoom.id, {
          ...roomData,
          ...additionalFields
        });
        const updatedRoom = mapApiRoomToRoom(response.data.room);
        setRooms(rooms.map(room => (room.id === currentRoom.id ? updatedRoom : room)));
      }

      setShowModal(false);
      // Здесь можно добавить оповещение об успешном добавлении/редактировании
    } catch (error) {
      console.error(
        `Ошибка при ${modalMode === 'add' ? 'добавлении' : 'редактировании'} номера:`,
        error
      );
      // Здесь можно добавить оповещение об ошибке
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

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

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
              <RoomCard 
                key={room.id} 
                room={room} 
                onEdit={handleEditRoom} 
                onDelete={handleDeleteRoom} 
              />
            ))}
          </RoomsGrid>

          {totalPages > 1 && (
            <Pagination>
              <PageButton onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                <i className="fas fa-chevron-left"></i>
              </PageButton>

              {Array.from({ length: totalPages }, (_, i) => i).map(number => (
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
        <RoomForm
          formData={formData}
          modalMode={modalMode}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleAmenitiesChange={handleAmenitiesChange}
        />
      )}

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && roomToDelete && (
        <DeleteConfirmation
          room={roomToDelete}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDeleteRoom}
        />
      )}
    </PageContainer>
  );
};

export default RoomsPage; 