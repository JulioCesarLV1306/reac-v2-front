import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

/**
 * API de autenticación (mock)
 * En producción esto se conectaría a un backend real
 */

// Mock user
const mockUser: User = {
  id: '1',
  name: 'Usuario Demo',
  email: 'demo@example.com',
  role: 'user',
};

export const authApi = {
  /**
   * Iniciar sesión
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulación de validación
    if (credentials.email && credentials.password) {
      return {
        user: {
          ...mockUser,
          name: credentials.email.split('@')[0],
          email: credentials.email,
        },
        token: 'mock-jwt-token-xyz',
      };
    }

    throw new Error('Credenciales inválidas');
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: String(Date.now()),
      name: data.name,
      email: data.email,
      role: 'user',
    };

    return {
      user: newUser,
      token: 'mock-jwt-token-new',
    };
  },

  /**
   * Cerrar sesión
   */
  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Obtener usuario actual (validar token)
   */
  getCurrentUser: async (): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // En producción verificaría el token
    return mockUser;
  },
};
