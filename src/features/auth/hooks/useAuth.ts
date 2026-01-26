import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import type { LoginCredentials, RegisterData } from '../types';
import { useAuthStore } from '@/stores/authStore';

const AUTH_KEYS = {
  user: ['auth', 'user'] as const,
};

/**
 * Hook para obtener el usuario actual
 */
export const useCurrentUser = () => {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: AUTH_KEYS.user,
    queryFn: async () => {
      const user = await authApi.getCurrentUser();
      setUser(user);
      return user;
    },
    retry: false,
  });
};

/**
 * Hook para iniciar sesión
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user });
    },
  });
};

/**
 * Hook para registrarse
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('token', data.token);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user });
    },
  });
};

/**
 * Hook para cerrar sesión
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      localStorage.removeItem('token');
      queryClient.clear();
    },
  });
};
