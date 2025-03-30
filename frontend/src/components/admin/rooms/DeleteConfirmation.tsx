import React from 'react';
import {
  ModalOverlay,
  DeleteConfirmModal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ConfirmText,
  ConfirmButtons,
  ConfirmCancelButton,
  ConfirmDeleteButton,
} from './RoomStyles';
import { Room } from './types';

interface DeleteConfirmationProps {
  room: Room;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ room, onClose, onConfirm }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <DeleteConfirmModal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Подтверждение</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ConfirmText>
          Вы уверены, что хотите удалить номер <strong>{room.title}</strong>?
          <br />
          Это действие нельзя отменить.
        </ConfirmText>

        <ConfirmButtons>
          <ConfirmCancelButton onClick={onClose}>Отмена</ConfirmCancelButton>
          <ConfirmDeleteButton onClick={onConfirm}>Удалить</ConfirmDeleteButton>
        </ConfirmButtons>
      </DeleteConfirmModal>
    </ModalOverlay>
  );
};

export default DeleteConfirmation; 