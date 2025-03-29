export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegistrationData extends UserLoginData {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 