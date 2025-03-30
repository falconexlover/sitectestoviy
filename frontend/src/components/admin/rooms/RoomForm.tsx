import React from 'react';
import {
  Form,
  FormRow,
  FormGroup,
  Label,
  Input,
  Select,
  Textarea,
  Checkbox,
  ButtonGroup,
  CancelButton,
  SubmitButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
} from './RoomStyles';
import { RoomFormData, roomTypes, amenitiesList } from './types';

interface RoomFormProps {
  formData: RoomFormData;
  modalMode: 'add' | 'edit';
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleAmenitiesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({
  formData,
  modalMode,
  onClose,
  onSubmit,
  handleInputChange,
  handleAmenitiesChange,
}) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {modalMode === 'add' ? 'Добавление номера' : 'Редактирование номера'}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={onSubmit}>
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
            <CancelButton type="button" onClick={onClose}>
              Отмена
            </CancelButton>
            <SubmitButton type="submit">
              {modalMode === 'add' ? 'Добавить номер' : 'Сохранить изменения'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RoomForm; 