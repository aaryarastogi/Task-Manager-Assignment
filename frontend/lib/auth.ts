import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

export const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    name,
  });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('Attempting login with email:', email);
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    // Re-throw with more context
    if (error.response) {
      throw error; // Axios error with response
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('Network error: Could not reach the server');
    } else {
      console.error('Error setting up request:', error.message);
      throw error;
    }
  }
};

export const logout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  const response = await api.post('/auth/reset-password', {
    email,
    newPassword,
  });
  return response.data;
};

