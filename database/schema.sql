-- =============================================================================
-- SCRIPT DDL - BASE DE DATOS MYSQL
-- Sistema de Control de Actividades y Tiempo
-- Generado mediante Ingeniería Inversa del Proyecto React/TypeScript
-- Fecha: 2026-01-28
-- =============================================================================

-- =============================================================================
-- FASE 1: ANÁLISIS DE ENTIDADES Y RELACIONES
-- =============================================================================
-- 
-- ENTIDADES DETECTADAS:
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │ 1. USERS (usuarios)                                                         │
-- │    - Fuente: auth/types/index.ts, SupervisorPage.tsx, AdminPage.tsx        │
-- │    - Campos: id, name, email, password_hash, role, dependencia, cargo      │
-- │    - Relaciones: 1:N con activities, N:M con day_configs                   │
-- │                                                                             │
-- │ 2. ROLES                                                                    │
-- │    - Fuente: types/roles.ts, config/rolesConfig.ts                         │
-- │    - Campos: id, name, display_name, description, color, icon, default_view│
-- │    - Relaciones: 1:N con users, N:M con views (role_views)                 │
-- │                                                                             │
-- │ 3. VIEWS (vistas del sistema)                                              │
-- │    - Fuente: types/views.ts, config/viewsConfig.tsx                        │
-- │    - Campos: id, name, display_name, description, path                     │
-- │    - Relaciones: N:M con roles (role_views)                                │
-- │                                                                             │
-- │ 4. ACTIVITIES (actividades)                                                │
-- │    - Fuente: time-tracker/types/index.ts, activityApi.ts                   │
-- │    - Campos: id, title, description, start_date, end_date, status, user_id │
-- │    - Relaciones: N:1 con users                                             │
-- │                                                                             │
-- │ 5. DAY_CONFIGS (configuración de días especiales)                          │
-- │    - Fuente: types/dayConfig.ts, stores/dayConfigStore.ts                  │
-- │    - Campos: id, date, type, required_hours, is_global                     │
-- │    - Relaciones: N:M con users (day_config_users)                          │
-- │                                                                             │
-- │ 6. DEPENDENCIAS (departamentos)                                            │
-- │    - Fuente: SupervisorPage.tsx, AdminPage.tsx                             │
-- │    - Campos: id, nombre, descripcion                                        │
-- │    - Relaciones: 1:N con users                                             │
-- │                                                                             │
-- │ 7. AUTH_TOKENS (tokens de autenticación)                                   │
-- │    - Fuente: auth/types/index.ts (AuthResponse)                            │
-- │    - Campos: id, user_id, token, expires_at                                │
-- │    - Relaciones: N:1 con users                                             │
-- └─────────────────────────────────────────────────────────────────────────────┘
--
-- DIAGRAMA DE RELACIONES:
-- 
--   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
--   │ dependencias │──<──│    users     │──>──│    roles     │
--   └──────────────┘     └──────┬───────┘     └──────┬───────┘
--                               │                    │
--                        ┌──────┴──────┐      ┌──────┴──────┐
--                        │             │      │             │
--                   ┌────▼────┐  ┌─────▼─────┐│    ┌────────▼────────┐
--                   │activities│  │auth_tokens││    │   role_views    │
--                   └──────────┘  └───────────┘│    └────────┬────────┘
--                                              │             │
--                   ┌──────────────────────────┘      ┌──────▼──────┐
--                   │                                 │    views    │
--            ┌──────▼──────┐                          └─────────────┘
--            │ day_configs │
--            └──────┬──────┘
--                   │
--            ┌──────▼──────────┐
--            │day_config_users │
--            └─────────────────┘
--
-- =============================================================================

-- =============================================================================
-- FASE 2: SCRIPT DDL
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Eliminar tablas existentes (en orden de dependencias)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `day_config_users`;
DROP TABLE IF EXISTS `day_configs`;
DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `auth_tokens`;
DROP TABLE IF EXISTS `role_views`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `views`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `dependencias`;

-- =============================================================================
-- TABLA: dependencias
-- Descripción: Departamentos/áreas de la organización
-- Fuente: SupervisorPage.tsx, AdminPage.tsx (user.dependencia)
-- =============================================================================
CREATE TABLE `dependencias` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL COMMENT 'Nombre del departamento',
    `descripcion` VARCHAR(255) NULL COMMENT 'Descripción del departamento',
    `activo` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Estado del departamento',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_dependencias_nombre` (`nombre`),
    INDEX `idx_dependencias_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Departamentos/dependencias de la organización';

-- =============================================================================
-- TABLA: roles
-- Descripción: Roles del sistema con permisos
-- Fuente: types/roles.ts (RoleType: 'trabajador' | 'supervisor' | 'administrador')
-- =============================================================================
CREATE TABLE `roles` (
    `id` VARCHAR(50) NOT NULL COMMENT 'Identificador único del rol (trabajador, supervisor, administrador)',
    `name` VARCHAR(50) NOT NULL COMMENT 'Nombre técnico del rol',
    `display_name` VARCHAR(100) NOT NULL COMMENT 'Nombre visible para el usuario',
    `description` VARCHAR(255) NOT NULL COMMENT 'Descripción del rol y sus permisos',
    `color` VARCHAR(20) NOT NULL DEFAULT '#a71900' COMMENT 'Color hexadecimal para UI',
    `icon` VARCHAR(50) NULL COMMENT 'Icono asociado al rol',
    `default_view` VARCHAR(50) NULL COMMENT 'Vista por defecto al iniciar sesión',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Estado del rol',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_roles_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Roles del sistema con configuración de permisos';

-- =============================================================================
-- TABLA: views
-- Descripción: Vistas/módulos disponibles en el sistema
-- Fuente: types/views.ts (ViewType: activities, supervisor, reports, users, settings)
-- =============================================================================
CREATE TABLE `views` (
    `id` VARCHAR(50) NOT NULL COMMENT 'Identificador único de la vista',
    `name` VARCHAR(100) NOT NULL COMMENT 'Nombre técnico de la vista',
    `display_name` VARCHAR(100) NOT NULL COMMENT 'Nombre visible para el usuario',
    `description` VARCHAR(255) NULL COMMENT 'Descripción de la funcionalidad',
    `path` VARCHAR(100) NOT NULL COMMENT 'Ruta de navegación (URL)',
    `icon` VARCHAR(50) NULL COMMENT 'Icono de la vista',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Orden de aparición en menú',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Estado de la vista',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_views_path` (`path`),
    INDEX `idx_views_active_order` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Vistas/módulos del sistema disponibles';

-- =============================================================================
-- TABLA: role_views
-- Descripción: Relación N:M entre roles y vistas (permisos de acceso)
-- Fuente: types/roles.ts (Role.allowedViews[])
-- =============================================================================
CREATE TABLE `role_views` (
    `role_id` VARCHAR(50) NOT NULL,
    `view_id` VARCHAR(50) NOT NULL,
    `can_read` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Permiso de lectura',
    `can_write` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Permiso de escritura',
    `can_delete` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Permiso de eliminación',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`role_id`, `view_id`),
    
    CONSTRAINT `fk_role_views_role` 
        FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_role_views_view` 
        FOREIGN KEY (`view_id`) REFERENCES `views`(`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Permisos de acceso de roles a vistas';

-- =============================================================================
-- TABLA: users
-- Descripción: Usuarios del sistema
-- Fuente: auth/types/index.ts, SupervisorPage.tsx (UserActivity), AdminPage.tsx (UserConfig)
-- ⚠️ ADVERTENCIA SEGURIDAD: El campo password_hash almacena contraseñas hasheadas
--    NUNCA almacenar contraseñas en texto plano. Usar bcrypt/argon2 con salt.
-- =============================================================================
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL COMMENT 'UUID del usuario',
    `name` VARCHAR(150) NOT NULL COMMENT 'Nombre completo del usuario',
    `email` VARCHAR(255) NOT NULL COMMENT 'Correo electrónico único',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '⚠️ HASH de contraseña (bcrypt/argon2) - NUNCA texto plano',
    `role_id` VARCHAR(50) NOT NULL DEFAULT 'trabajador' COMMENT 'Rol asignado al usuario',
    `dependencia_id` INT UNSIGNED NULL COMMENT 'Departamento al que pertenece',
    `cargo` VARCHAR(100) NULL COMMENT 'Cargo/puesto del usuario',
    `telefono` VARCHAR(20) NULL COMMENT 'Teléfono de contacto',
    `avatar_url` VARCHAR(500) NULL COMMENT 'URL de imagen de perfil',
    `fecha_ingreso` DATE NULL COMMENT 'Fecha de ingreso a la organización',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Usuario activo/inactivo',
    `email_verified_at` TIMESTAMP NULL COMMENT 'Fecha de verificación de email',
    `last_login_at` TIMESTAMP NULL COMMENT 'Último inicio de sesión',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`),
    INDEX `idx_users_role` (`role_id`),
    INDEX `idx_users_dependencia` (`dependencia_id`),
    INDEX `idx_users_active` (`is_active`),
    INDEX `idx_users_name` (`name`),
    
    CONSTRAINT `fk_users_role` 
        FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_users_dependencia` 
        FOREIGN KEY (`dependencia_id`) REFERENCES `dependencias`(`id`) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Usuarios del sistema - ⚠️ Contiene datos sensibles';

-- =============================================================================
-- TABLA: auth_tokens
-- Descripción: Tokens de autenticación JWT/sesiones
-- Fuente: auth/types/index.ts (AuthResponse.token)
-- =============================================================================
CREATE TABLE `auth_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` CHAR(36) NOT NULL COMMENT 'Usuario propietario del token',
    `token` VARCHAR(500) NOT NULL COMMENT 'Token JWT o de sesión',
    `token_type` ENUM('access', 'refresh', 'password_reset', 'email_verify') NOT NULL DEFAULT 'access',
    `device_info` VARCHAR(255) NULL COMMENT 'Información del dispositivo',
    `ip_address` VARCHAR(45) NULL COMMENT 'IP del cliente',
    `expires_at` TIMESTAMP NOT NULL COMMENT 'Fecha de expiración',
    `revoked_at` TIMESTAMP NULL COMMENT 'Fecha de revocación (si aplica)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_auth_tokens_user` (`user_id`),
    INDEX `idx_auth_tokens_expires` (`expires_at`),
    INDEX `idx_auth_tokens_token` (`token`(255)),
    
    CONSTRAINT `fk_auth_tokens_user` 
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tokens de autenticación y sesiones';

-- =============================================================================
-- TABLA: activities
-- Descripción: Registro de actividades laborales
-- Fuente: time-tracker/types/index.ts (Activity interface)
-- =============================================================================
CREATE TABLE `activities` (
    `id` CHAR(36) NOT NULL COMMENT 'UUID de la actividad',
    `user_id` CHAR(36) NOT NULL COMMENT 'Usuario que registra la actividad',
    `title` VARCHAR(200) NOT NULL COMMENT 'Título de la actividad',
    `description` TEXT NOT NULL COMMENT 'Descripción detallada de la actividad',
    `start_date` DATETIME NOT NULL COMMENT 'Fecha y hora de inicio',
    `end_date` DATETIME NOT NULL COMMENT 'Fecha y hora de fin',
    `start_time` TIME GENERATED ALWAYS AS (TIME(`start_date`)) STORED COMMENT 'Hora de inicio (calculado)',
    `end_time` TIME GENERATED ALWAYS AS (TIME(`end_date`)) STORED COMMENT 'Hora de fin (calculado)',
    `duration_minutes` INT GENERATED ALWAYS AS (TIMESTAMPDIFF(MINUTE, `start_date`, `end_date`)) STORED COMMENT 'Duración en minutos (calculado)',
    `status` ENUM('Pendiente', 'Completada', 'Cancelada') NOT NULL DEFAULT 'Pendiente' COMMENT 'Estado de la actividad',
    `approved_by` CHAR(36) NULL COMMENT 'Supervisor que aprobó (si aplica)',
    `approved_at` TIMESTAMP NULL COMMENT 'Fecha de aprobación',
    `rejection_reason` VARCHAR(500) NULL COMMENT 'Motivo de rechazo (si aplica)',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_activities_user` (`user_id`),
    INDEX `idx_activities_date` (`start_date`),
    INDEX `idx_activities_status` (`status`),
    INDEX `idx_activities_user_date` (`user_id`, `start_date`),
    INDEX `idx_activities_approver` (`approved_by`),
    
    CONSTRAINT `fk_activities_user` 
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_activities_approver` 
        FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) 
        ON DELETE SET NULL ON UPDATE CASCADE,
        
    -- Validación: end_date debe ser posterior a start_date
    CONSTRAINT `chk_activities_dates` CHECK (`end_date` > `start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de actividades laborales de usuarios';

-- =============================================================================
-- TABLA: day_configs
-- Descripción: Configuración de días especiales (feriados, recuperación)
-- Fuente: types/dayConfig.ts (DayConfig interface)
-- =============================================================================
CREATE TABLE `day_configs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL COMMENT 'Fecha de la configuración',
    `type` ENUM('normal', 'feriado', 'recuperacion') NOT NULL DEFAULT 'normal' COMMENT 'Tipo de día',
    `required_hours` DECIMAL(4,2) NOT NULL DEFAULT 8.00 COMMENT 'Horas requeridas (normal=8, recuperacion=9, feriado=0)',
    `is_global` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'TRUE=Aplica a todos (feriados), FALSE=Solo usuarios específicos',
    `descripcion` VARCHAR(200) NULL COMMENT 'Descripción del día especial (ej: Día del Trabajador)',
    `created_by` CHAR(36) NULL COMMENT 'Usuario que creó la configuración',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_day_configs_date_global` (`date`, `is_global`),
    INDEX `idx_day_configs_date` (`date`),
    INDEX `idx_day_configs_type` (`type`),
    INDEX `idx_day_configs_global` (`is_global`),
    
    CONSTRAINT `fk_day_configs_creator` 
        FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Configuración de días especiales (feriados, recuperación)';

-- =============================================================================
-- TABLA: day_config_users
-- Descripción: Relación N:M entre day_configs y users (días de recuperación por usuario)
-- Fuente: types/dayConfig.ts (DayConfig.aplicadoA[])
-- =============================================================================
CREATE TABLE `day_config_users` (
    `day_config_id` BIGINT UNSIGNED NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha en que se asignó',
    `applied_by` CHAR(36) NULL COMMENT 'Administrador que asignó',
    
    PRIMARY KEY (`day_config_id`, `user_id`),
    INDEX `idx_day_config_users_user` (`user_id`),
    
    CONSTRAINT `fk_day_config_users_config` 
        FOREIGN KEY (`day_config_id`) REFERENCES `day_configs`(`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_day_config_users_user` 
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_day_config_users_applier` 
        FOREIGN KEY (`applied_by`) REFERENCES `users`(`id`) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Asignación de días especiales a usuarios específicos';

-- =============================================================================
-- TABLA: activity_logs (Tabla de auditoría)
-- Descripción: Registro de cambios en actividades para auditoría
-- =============================================================================
CREATE TABLE `activity_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `activity_id` CHAR(36) NOT NULL COMMENT 'Actividad afectada',
    `user_id` CHAR(36) NOT NULL COMMENT 'Usuario que realizó la acción',
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT') NOT NULL,
    `old_values` JSON NULL COMMENT 'Valores anteriores (para UPDATE)',
    `new_values` JSON NULL COMMENT 'Valores nuevos',
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_activity_logs_activity` (`activity_id`),
    INDEX `idx_activity_logs_user` (`user_id`),
    INDEX `idx_activity_logs_action` (`action`),
    INDEX `idx_activity_logs_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Auditoría de cambios en actividades';

-- =============================================================================
-- DATOS INICIALES (SEEDS)
-- =============================================================================

-- Insertar dependencias de ejemplo
INSERT INTO `dependencias` (`nombre`, `descripcion`) VALUES
('Informática', 'Departamento de Tecnologías de la Información'),
('Recursos Humanos', 'Gestión del talento humano'),
('Administración', 'Administración general'),
('Contabilidad', 'Departamento contable y financiero'),
('Operaciones', 'Departamento de operaciones');

-- Insertar roles del sistema
INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `color`, `default_view`) VALUES
('trabajador', 'trabajador', 'Trabajador', 'Usuario que registra sus propias actividades', '#a71900', 'activities'),
('supervisor', 'supervisor', 'Supervisor', 'Supervisa las actividades de los trabajadores', '#a71900', 'supervisor'),
('administrador', 'administrador', 'Administrador / RRHH', 'Acceso completo al sistema', '#a71900', 'users');

-- Insertar vistas del sistema
INSERT INTO `views` (`id`, `name`, `display_name`, `description`, `path`, `sort_order`) VALUES
('activities', 'activities', 'Mis Actividades', 'Vista de actividades del trabajador', '/activities', 1),
('supervisor', 'supervisor', 'Supervisar', 'Vista de supervisión de actividades', '/supervisor', 2),
('reports', 'reports', 'Reportes', 'Vista de reportes y estadísticas', '/reports', 3),
('users', 'users', 'Gestión de Usuarios', 'Vista de gestión de usuarios', '/users', 4),
('settings', 'settings', 'Configuración', 'Vista de configuración del sistema', '/settings', 5);

-- Asignar permisos de vistas a roles
INSERT INTO `role_views` (`role_id`, `view_id`, `can_read`, `can_write`, `can_delete`) VALUES
-- Trabajador: solo actividades
('trabajador', 'activities', 1, 1, 1),
-- Supervisor: actividades + supervisión + reportes
('supervisor', 'activities', 1, 1, 1),
('supervisor', 'supervisor', 1, 1, 0),
('supervisor', 'reports', 1, 0, 0),
-- Administrador: acceso total
('administrador', 'activities', 1, 1, 1),
('administrador', 'supervisor', 1, 1, 1),
('administrador', 'reports', 1, 1, 1),
('administrador', 'users', 1, 1, 1),
('administrador', 'settings', 1, 1, 1);

-- =============================================================================
-- VISTAS ÚTILES
-- =============================================================================

-- Vista: Resumen de actividades por usuario y fecha
CREATE OR REPLACE VIEW `v_daily_activity_summary` AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    d.nombre AS dependencia,
    u.cargo,
    DATE(a.start_date) AS activity_date,
    COUNT(a.id) AS total_activities,
    SUM(a.duration_minutes) AS total_minutes,
    ROUND(SUM(a.duration_minutes) / 60, 2) AS total_hours,
    dc.type AS day_type,
    dc.required_hours,
    CASE 
        WHEN dc.type = 'feriado' THEN 'Feriado'
        WHEN ROUND(SUM(a.duration_minutes) / 60, 2) >= dc.required_hours THEN 'Cumplido'
        ELSE 'Pendiente'
    END AS status
FROM users u
LEFT JOIN activities a ON u.id = a.user_id
LEFT JOIN dependencias d ON u.dependencia_id = d.id
LEFT JOIN day_configs dc ON DATE(a.start_date) = dc.date AND (dc.is_global = 1 OR EXISTS (
    SELECT 1 FROM day_config_users dcu WHERE dcu.day_config_id = dc.id AND dcu.user_id = u.id
))
WHERE u.is_active = 1
GROUP BY u.id, u.name, d.nombre, u.cargo, DATE(a.start_date), dc.type, dc.required_hours;

-- Vista: Usuarios con su rol y dependencia
CREATE OR REPLACE VIEW `v_users_full` AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.cargo,
    r.display_name AS rol,
    d.nombre AS dependencia,
    u.is_active,
    u.last_login_at,
    u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id
LEFT JOIN dependencias d ON u.dependencia_id = d.id;

-- =============================================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =============================================================================

-- Índice para búsqueda de actividades por rango de fechas
CREATE INDEX `idx_activities_date_range` ON `activities` (`start_date`, `end_date`);

-- Índice para reportes de actividades por usuario y mes
CREATE INDEX `idx_activities_user_month` ON `activities` (`user_id`, `start_date`);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================
