# Sistema de Gestión de Feriados y Días de Recuperación

## 📋 Descripción General

El sistema implementa la gestión completa de días especiales (feriados y días de recuperación) que afectan las horas laborales requeridas de los empleados.

**Importante:** Los **feriados son globales** y bloquean el registro de actividades para todos los usuarios. Los **días de recuperación son por usuario** específico.

## 🎯 Tipos de Días

### 1. Día Normal
- **Horas requeridas:** 8 horas
- **Color en calendario:** Blanco
- **Sin marcadores especiales**
- **Registro:** Permitido

### 2. Día Feriado 🔴
- **Horas requeridas:** 0 horas (no laborable)
- **Color en calendario:** Rojo (bg-red-100)
- **Indicador:** Punto rojo en el día
- **Icono:** 🎉
- **Alcance:** **GLOBAL** - Aplica a todos los usuarios
- **Registro:** **BLOQUEADO** - No se pueden registrar actividades
- **Propósito:** Validación para que ningún usuario trabaje en esas fechas

### 3. Día de Recuperación 🟡
- **Horas requeridas:** 9 horas (8 + 1 extra)
- **Color en calendario:** Ámbar (bg-amber-100)
- **Indicador:** Punto ámbar en el día
- **Icono:** ⚠️
- **Alcance:** **POR USUARIO** - Solo aplica a usuarios seleccionados
- **Registro:** Permitido (con meta de 9h)

## 👤 Vista del Administrador

### Configuración de Horas Trabajadas (AdminPage)

#### Pestaña "Horas a trabajar"
1. Seleccionar usuarios con checkboxes
2. Ingresar número de horas en el input
3. Clic en "Aplicar para seleccionados"
4. Las horas se actualizan en la tabla

#### Pestaña "Feriados"
1. **Seleccionar fecha en el calendario**
   - El calendario muestra visualmente días ya configurados
   - Rojo = Feriado (global)
   - Ámbar = Recuperación (por usuario)

2. **Elegir tipo de día especial**
   - Botón "Feriado" (0 horas) - **GLOBAL, no requiere selección de usuarios**
   - Botón "Recuperación" (9 horas) - **POR USUARIO, requiere selección**

3. **Seleccionar usuarios (solo para Recuperación)**
   - **Feriado:** No requiere seleccionar usuarios (es global automáticamente)
   - **Recuperación:** Checkbox individual o "Seleccionar todos"

4. **Aplicar configuración**
   - **Feriado:** Clic en "Aplicar feriado (global)" - No requiere usuarios seleccionados
   - **Recuperación:** Clic en "Aplicar recuperación" - Requiere al menos un usuario seleccionado
   - Los usuarios verán reflejado el cambio inmediatamente

5. **Borrar configuración**
   - Clic en "Borrar feriados" para el día seleccionado
   - Restaura las horas normales (8h)

### Indicadores Visuales
- **Información del día actual:** Si un día ya está configurado, se muestra un banner con el tipo y horas
- **Tabla actualizada:** La columna "Horas por trabajar" refleja el tipo de día configurado

## 👨‍💼 Vista del Supervisor

### WorkerActivitiesView

Cuando el supervisor revisa las actividades de un empleado:

1. **Banner informativo superior**
   - Aparece automáticamente si el día es especial
   - Muestra el tipo de día y horas requeridas
   - Color: Rojo (feriado) o Ámbar (recuperación)

2. **Total de horas trabajadas**
   - Verde: Si cumple o supera la meta
   - Rojo: Si no alcanza la meta
   - Muestra "Meta: Xh" debajo del total

3. **Calendario lateral**
   - Días con marcas de color según configuración
   - Punto indicador en días especiales

## 🧑‍💼 Vista del Empleado

### ActivitiesPage (Mis Actividades)

#### 1. Banner Superior de Día Especial
Aparece cuando el día seleccionado está configurado como especial:
- **Feriado:** Banner rojo con "🎉 Día feriado - No laborable"
- **Recuperación:** Banner ámbar con "⚠️ Día de recuperación - Se requiere 1 hora adicional"

#### 2. Tarjetas de Estadísticas (4 cards)
- **Total de horas trabajadas**
  - Verde con borde si cumple la meta
  - Rojo si no la cumple
  
- **Meta del día**
  - Muestra las horas requeridas según tipo de día
  - Color según tipo: Rojo (feriado), Ámbar (recuperación), Gris (normal)
  - Etiqueta del tipo debajo

- **Actividades**
  - Contador de actividades registradas

- **Objetivo cumplido / Faltan**
  - ✓ verde si cumplió
  - Número de horas faltantes en rojo si no

#### 3. Calendario
- Coloreado según tipo de día
- Puntos indicadores en días especiales

#### 4. Formulario de Nueva Actividad

Al abrir el formulario, se muestran:
🚫 Día Feriado - No se pueden registrar actividades"
  - Ámbar: "⚠️ Día de Recuperación - Se requieren 9 horas"

- **Bloqueo en feriados**
  - El formulario completo se oculta
  - Se muestra mensaje: "🎉 Este día está marcado como feriado - No se permite el registro de actividades"
  - **NO se puede registrar ninguna actividad**

- **En días de recuperación:**
  - Formulario activo y funcional
  - Indicador de meta: "💡 Meta del día: 9
- **Indicador de meta**
  - Cuadro azul con "💡 Meta del día: Xh"
  - Muestra las horas de la actividad actual mientras se completa

## 🔧 Lógica de Validación

### Validación de Horas

```typescript
// Horas por defecto
const DEFAULT_HOURS = {
  normal: 8,
  recuperacion: 9,
  feriado: 0
};Bloqueo de Registro en Feriados

```typescript
// En ActivityForm.tsx
const isFeriado = dayConfig?.type === 'feriado';

// Si es feriado:
// - Formulario completo se oculta
// - Se muestra mensaje de bloqueo
// - NO se pueden registrar actividades
```

### Sugerencias al Usuario

El sistema sugiere automáticamente:
- En día normal: Cumplir 8 horas
- En día recuperación: Cumplir 9 horas (8+1)
- En día feriado: **BLOQUEADO** - No se puede registrar
### Sugerencias al Usuario

El sistema sugiere automáticamente:
- En día normal: Cumplir 8 horas
- En día recuperación: Cumplir 9 horas (8+1)
- En día feriado: No se requieren horas (pero se pueden registrar actividades si es necesario)

## 🎨 Colores y Estilos

### Calendario
```typescript
DAY_COLORS = {
  normal: {
    bg: 'bg-white',
    text: 'text-slate-900',
    border: 'border-slate-200'
  },
  feriado: {
    bg: 'bg-red-100',
    text: 'text-red-900',
    border: 'border-red-300'
  },
  recuperacion: {
    bg: 'bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-300'
  }
}
```

### Estados
- **Meta cumplida:** text-green-600, ring-green-500
- **Meta no cumplida:** text-red-600
- **Banner feriado:** bg-red-50, border-red-300, text-red-700
- **Banner recuperación:** bg-amber-50, border-amber-300, text-amber-700

## 💾 Persistencia

Los datos s?: string[];    // ['userId1', 'userId2'] - Solo para recuperación
  isGlobal: boolean;      // true = Feriado (todos), false = Recuperación (específico)
- **Store Zustand:** `useDayConfigStore`
- **LocalStorage:** Clave `day-config-storage`
- **Formato de fecha:** 'YYYY-MM-DD' (ISO 8601)

### Estructura de Datos (GLOBAL)

1. **Admin accede a AdminPage**
2. Selecciona tab "Feriados"
3. Hace clic en fecha 5 de enero en el calendario
4. Selecciona botón "Feriado" (0 horas)
5. **NO necesita seleccionar usuarios** (es global)
6. Clic "Aplicar feriado (global)"
7. **Resultado:** 
   - El día 5 se marca en rojo en todos los calendarios
   - **TODOS los usuarios** tienen bloqueado el registro de actividades en esa fecha
   - Formulario de actividades se oculta automáticamente para todos

### Escenario 2: Configurar Día de Recuperación (POR USUARIO)

1. **Admin accede a AdminPage**
2. Selecciona tab "Feriados"
3. Hace clic en fecha 9 de enero
4. Selecciona botón "Recuperación" (9 horas)
5. **Marca checkboxes de usuarios específicos** (Obligatorio)
6. Clic "Aplicar recuperación"
7. **Resultado:**
   - Solo los usuarios selintenta registrar actividad en feriado

1. **Empleado accede a Mis Actividades**
2. Selecciona día feriado (5 de enero)
3. Ve banner rojo: "🚫 Día Feriado - No se pueden registrar actividades"
4. **Formulario de actividades está completamente oculto**
5. Mensaje: "🎉 Este día está marcado como feriado - No se permite el registro"
6. **NO puede registrar ninguna actividad** (validación de negocio)
1. **Admin accede a AdminPage**
2. Selecciona tab "Feriados"
3. Hace clic en fecha 5 de enero en el calendario
4. Selecciona botEmpleado registra actividad en día de recuperación

1. **Empleado accede a Mis Actividades**
2. Selecciona día de recuperación (9 de enero)
3. Ve banner ámbar: "⚠️ Se requieren 9 horas"
4. Formulario activo y funcional
5. Ve indicador: "💡 Meta del día: 9h"
6. Registra actividades hasta completar 9 horas
7. Stats muestran objetivo cumplido ✓ en verde

### Escenario 4: Supervisor valida horas en feriado

1. **Supervisor accede a SupervisorPage**
2. Clic "Ver actividades" de un empleado
3. Selecciona día feriado (5 de enero)
4. Ve banner rojo: "🎉 Día feriado - No se requieren horas"
5. Ve mensaje adicional: "🚫 No se permite el registro de actividades"
6. Tabla de actividades vacía (usuario no pudo registrar nada)dades**
2. Selecciona día de recuperación (9 de enero)
3. Ve banner ámbar: "Se requieren 9 horas"
4. Abre formulario de nueva actividad
5. Ve indicador: "Meta del día: 9h"
6. Registra actividades hasta completar 9 horas
7. Stats muestran objetivo cumplido ✓ en verde

### Escenario 3: Supervisor valida horas en feriado

1. **Supervisor accede a SupervisorPage**
2. Clic "Ver actividades" de un empleado
3. Selecciona día feriado (14 de enero)
4. Ve banner rojo: "Día feriado - No se requieren horas"
5. Ve total de horas: Verde (cualquier hora cumple, meta = 0)
6. Valida actividades normalmente

## ⚙️ Archivos Modificados

### Nuevos Archivos
- `src/types/dayConfig.ts` - Types y constantes
- `src/stores/dayConfigStore.ts` - Store Zustand para configuración

### Archivos Actualizados
- `AdminPage.tsx` - Pestaña Feriados completa
- `ActivityCalendar.tsx` - Colores y indicadores visuales
- `ActivitiesPage.tsx` - Stats y banners informativos
- `ActivityForm.tsx` - Indicadores de meta y horas
- `WorkerActivitiesView.tsx` - Banner y validación de horas
- `stores/index.ts` - Export del nuevo store

## 🧪 Testing

Para probar el sistema:

1. **Configurar un feriado:**
   - Login como administrador
   - AdminPage > Feriados
   - Seleccionar fecha y aplicar

2. **Verificar en empleado:**
   - Login como trabajador
   - Ver calendario coloreado
   - Verificar banner y meta

3. *Feriados son GLOBALES:** Afectan a todos los usuarios sin excepción y bloquean el registro
- **Recuperación es POR USUARIO:** Cada configuración se aplica a usuarios específicos seleccionados
- **Validación estricta:** Los feriados bloquean completamente el formulario de registro
- **Sin backend:** Actualmente mock, preparado para API calls
- **Colores consistentes:** Rojo = Feriado (global), Ámbar = Recuperación (específico)
   - Verificar indicadores de cumplimiento

## 📝 Notas Importantes

- **Fechas en formato ISO:** Siempre usar 'YYYY-MM-DD' para consistencia
- **Persistencia local:** Los datos se mantienen en localStorage
- **Aplicación por usuario:** Cada configuración se aplica a usuarios específicos
- **Sin backend:** Actualmente mock, preparado para API calls
- **Colores consistentes:** Rojo = Feriado, Ámbar = Recuperación en todo el sistema
