# Sistema de Roles y Permisos

Este sistema permite gestionar roles y permisos de manera escalable y centralizada.

## 📁 Estructura de Archivos

```
src/
├── types/
│   ├── roles.ts          # Tipos de roles y vistas
│   └── views.ts          # Tipos de configuración de vistas
├── config/
│   ├── rolesConfig.ts    # Configuración de roles y permisos
│   └── viewsConfig.tsx   # Configuración de vistas disponibles
└── hooks/
    └── useRoleAccess.ts  # Hook para verificar permisos
```

## 🚀 Cómo agregar un nuevo rol

### Paso 1: Agregar el tipo de rol
En `src/types/roles.ts`:

```typescript
export type RoleType = 'trabajador' | 'supervisor' | 'administrador' | 'rrhh' | 'tu_nuevo_rol';
```

### Paso 2: Configurar el nuevo rol
En `src/config/rolesConfig.ts`:

```typescript
export const ROLES: Record<RoleType, Role> = {
  // ... roles existentes
  tu_nuevo_rol: {
    id: 'tu_nuevo_rol',
    name: 'tu_nuevo_rol',
    displayName: 'Tu Nuevo Rol',
    description: 'Descripción del rol',
    color: '#6366f1',  // Color del rol en formato hex
    allowedViews: ['activities', 'supervisor'],  // Vistas a las que tiene acceso
    defaultView: 'activities',  // Vista por defecto al seleccionar este rol
  },
};
```

### Paso 3: ¡Listo!
El sidebar se actualizará automáticamente mostrando el nuevo rol.

## 🎨 Cómo agregar una nueva vista

### Paso 1: Agregar el tipo de vista
En `src/types/roles.ts`:

```typescript
export type ViewType = 
  | 'activities'
  | 'supervisor'
  | 'reports'
  | 'users'
  | 'settings'
  | 'tu_nueva_vista';
```

### Paso 2: Crear el componente de la vista
Crear un nuevo componente React para la vista, por ejemplo:

```typescript
// src/features/tu-modulo/components/TuVista.tsx
export const TuVista = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1>Tu Nueva Vista</h1>
      {/* Tu contenido */}
    </div>
  );
};
```

### Paso 3: Registrar la vista
En `src/config/viewsConfig.tsx`:

```typescript
import { TuVista } from '@/features/tu-modulo/components';

export const VIEWS: Record<ViewType, ViewConfig> = {
  // ... vistas existentes
  tu_nueva_vista: {
    id: 'tu_nueva_vista',
    name: 'tu_nueva_vista',
    displayName: 'Tu Nueva Vista',
    description: 'Descripción de la vista',
    component: TuVista,
    path: '/tu-nueva-vista',
  },
};
```

### Paso 4: Asignar la vista a roles
En `src/config/rolesConfig.ts`, agregar la vista a los roles que deben tener acceso:

```typescript
supervisor: {
  // ...
  allowedViews: ['supervisor', 'activities', 'reports', 'tu_nueva_vista'],
  // ...
},
```

## 🔐 Sistema de Permisos

### Verificar si un rol tiene acceso a una vista

```typescript
import { hasViewAccess } from '@/config/rolesConfig';

if (hasViewAccess('supervisor', 'reports')) {
  // El supervisor tiene acceso a reportes
}
```

### Usar el hook de acceso

```typescript
import { useRoleAccess } from '@/hooks/useRoleAccess';

const { canAccessView, availableViews, defaultView } = useRoleAccess('supervisor');

if (canAccessView('reports')) {
  // Mostrar contenido
}
```

## 📊 Roles Actuales

| Rol | Display | Vistas Permitidas | Vista por Defecto |
|-----|---------|------------------|-------------------|
| trabajador | Trabajador | activities | activities |
| supervisor | Supervisor | supervisor, activities, reports | supervisor |
| administrador | Administrador | todas | supervisor |
| rrhh | Recursos Humanos | reports, users, activities | reports |

## 🎯 Vistas Disponibles

| Vista | Display | Descripción | Ruta |
|-------|---------|-------------|------|
| activities | Mis Actividades | Gestión de actividades del trabajador | /activities |
| supervisor | Supervisar | Supervisión de actividades de usuarios | /supervisor |
| reports | Reportes | Generación de reportes (en desarrollo) | /reports |
| users | Usuarios | Gestión de usuarios (en desarrollo) | /users |
| settings | Configuración | Configuración del sistema (en desarrollo) | /settings |

## 💡 Ventajas del Sistema

✅ **Escalable**: Agregar nuevos roles y vistas es simple y rápido  
✅ **Centralizado**: Toda la configuración está en un solo lugar  
✅ **Tipado**: TypeScript previene errores de configuración  
✅ **Flexible**: Fácil de mantener y modificar  
✅ **Automático**: El UI se actualiza automáticamente al agregar roles  

## 🔧 Mantenimiento

### Para desactivar el panel de debug
En `src/App.tsx`, remover o comentar el componente `<DebugPanel>`:

```typescript
// {/* Panel de debug - remover en producción */}
// <DebugPanel>
//   ...
// </DebugPanel>
```

### Para cambiar el rol por defecto
En `src/config/rolesConfig.ts`:

```typescript
export const ROLE_CONFIG: RoleConfig = {
  roles: Object.values(ROLES),
  defaultRole: 'trabajador',  // Cambiar aquí
};
```
