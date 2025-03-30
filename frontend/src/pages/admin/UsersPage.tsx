import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { authService } from '../../services/api';

const UsersContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background: var(--primary-color);
  color: white;
  padding: 1rem;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f5f5f5;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: var(--accent-color);
  color: white;

  &:hover {
    opacity: 0.9;
  }

  &.delete {
    background: #dc3545;
  }
`;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface UsersResponse {
  data: {
    users: User[];
  };
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await authService.getAllUsers();
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await authService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Ошибка при удалении пользователя');
      }
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string): Promise<void> => {
    try {
      await authService.updateUserRole(userId, newRole);
      setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
    } catch (err) {
      setError('Ошибка при обновлении роли пользователя');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <UsersContainer>
      <h1>Управление пользователями</h1>
      <UsersTable>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Имя</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Роль</TableHeader>
            <TableHeader>Действия</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <select value={user.role} onChange={e => handleUpdateRole(user.id, e.target.value)}>
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </TableCell>
              <TableCell>
                <ActionButton className="delete" onClick={() => handleDeleteUser(user.id)}>
                  Удалить
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </UsersTable>
    </UsersContainer>
  );
};

export default UsersPage; 