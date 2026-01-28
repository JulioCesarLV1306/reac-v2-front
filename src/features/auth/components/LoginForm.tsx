'use client';

import { useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useLogin } from '../hooks';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Panel Izquierdo - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <div className="w-50 h-32 mx-auto mb-4 flex items-center justify-center">
                <img
                  src="/Corte_logo.png"
                  alt="Logo Corte Superior de Justicia del Santa"
                  className="w-full h-full object-contain lazyload"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Inicia sesión
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Ingresa tus credenciales para acceder a tu cuenta:
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Correo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo
              </label>
              <Input
                type="email"
                placeholder="correoejemplo@hotmail.com"
                {...register('email')}
                disabled={login.isPending}
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="col-span-12 relative flex items-center">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  {...register('password')}
                  disabled={login.isPending}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="border-amber-700 bg-amber-200  flex items-center justify-center cursor-pointer text-gray-600"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error de login */}
            {login.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">
                  Credenciales inválidas. Por favor intenta de nuevo.
                </p>
              </div>
            )}

            {/* Botón Submit */}
            <Button
              style={{ backgroundColor: '#a71900' }}
              type="submit"
              disabled={login.isPending}
              className="w-full bg-[#a71900] hover:bg-[#6d1029] text-white py-3 text-base font-semibold"
            >
              {login.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </div>

        {/* Panel Derecho - Información */}
        <div className="text-center space-y-8 bg-white w-100 h-full p-8 md:p-12 rounded-2xl shadow-xl ">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              REAC 2.0
            </h2>
            <p className="text-xl text-gray-700 mb-2">
              Tu portal para
            </p>
            <p className="text-xl text-gray-700">
              registrar actividades
            </p>
            <p className="text-xl text-gray-700">
              fuera de la oficina
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Nota*:</span> Sólo se habilita REAC en
              periodos extensos donde no se ingresa a las instalaciones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginForm);
