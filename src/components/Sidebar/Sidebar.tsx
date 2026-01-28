import { useState, useRef, useEffect } from 'react';
import {
  MdChevronLeft,
  MdChevronRight,
  MdSupervisorAccount,
  MdPerson,
  MdGroup,
  MdWork,
  MdLogout
} from 'react-icons/md';
import { BiUser } from 'react-icons/bi';
import type { RoleType } from '@/types/roles';
import { getAllRoles } from '@/config/rolesConfig';

interface SidebarProps {
  onNavigate?: (role: RoleType) => void;
  initialRole?: RoleType;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
}

const roleIcons: Record<string, React.ElementType> = {
  supervisor: MdSupervisorAccount,
  manager: MdWork,
  employee: MdPerson,
  team: MdGroup,
  default: BiUser,
};

const Sidebar = ({
  onNavigate,
  initialRole = 'supervisor',
  onLogout,
  userName = 'Gabriel Andrade Hidalgo',
  userRole = 'Trabajador'
}: SidebarProps) => {
  const [activeRole, setActiveRole] = useState<RoleType>(initialRole);
  const [isOpen, setIsOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const availableRoles = getAllRoles();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleClick = (role: RoleType) => {
    setActiveRole(role);
    onNavigate?.(role);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getRoleIcon = (roleId: string) => roleIcons[roleId] || roleIcons.default;

  return (
    <div
      className={`
        flex flex-col h-screen relative
        bg-linear-to-br from-white via-gray-50/50 to-white
        border-r border-gray-200/80 backdrop-blur-xl
        transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isOpen ? 'w-85 px-6 py-7' : 'w-22 px-4 py-7'} 
      `}
      style={{
        boxShadow: isOpen
          ? '4px 0 24px rgba(0, 0, 0, 0.04), 2px 0 8px rgba(0, 0, 0, 0.02)'
          : '2px 0 12px rgba(0, 0, 0, 0.03)'
      }}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-50/20 via-transparent to-purple-50/20 pointer-events-none" />

      {/* Toggle Button con efecto glassmorphism */}
      <button
        onClick={toggleSidebar}
        className={`
          relative flex items-center justify-center rounded-2xl group
          bg-linear-to-br from-gray-800 via-gray-900 to-black
          text-white shadow-lg
          transition-all duration-500 ease-out z-10 mb-6
          hover:shadow-2xl hover:shadow-gray-900/30
          active:scale-90
          ${isOpen ? 'self-end w-11 h-11' : 'self-center w-14 h-14'}
        `}
      >
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className={`
          transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-110'}
        `}>
          <MdChevronLeft size={24} className="drop-shadow-sm" />
        </div>
      </button>

      {/* Contenido Principal */}
      <div className="flex flex-col flex-1 gap-5 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10">



        {/* Lista de Roles con animaciones staggered */}
        <div className="flex flex-col gap-3 items-center w-full">
          {availableRoles.map((role, index) => {
            const IconComponent = getRoleIcon(role.id);
            const isActive = activeRole === role.id;
            const isHovered = hoveredRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => handleRoleClick(role.id)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                title={!isOpen ? role.displayName : ''}
                className={`
                  relative flex items-center group overflow-hidden
                  transition-all duration-500 ease-out
                  ${isOpen
                    ? 'w-full p-4 rounded-2xl text-left gap-3.5'
                    : 'w-16 h-16 justify-center p-0 rounded-2xl'
                  }
                  ${isActive
                    ? 'shadow-lg scale-[1.02]'
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-[1.03] hover:shadow-md'
                  }
                `}
                style={{
                  borderWidth: '2px',
                  borderColor: isActive || isHovered ? role.color : 'rgb(243 244 246)',
                  backgroundColor: isActive ? role.color : undefined,
                  color: isActive ? 'white' : role.color,
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  transform: isActive ? 'translateX(4px)' : undefined
                }}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                    ${!isActive ? 'bg-linear-to-r from-transparent via-current to-transparent' : ''}
                  `}
                />

                {/* Animated border highlight */}
                {!isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-current transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-full"
                    style={{ backgroundColor: role.color }}
                  />
                )}

                {/* Icono con animación de pulse */}
                <div className={`
                  shrink-0 z-10 transition-all duration-300
                  ${isActive ? 'scale-100' : 'group-hover:scale-110'}
                `}>
                  <IconComponent
                    size={isOpen ? 24 : 32}
                    className="transition-all duration-300 drop-shadow-sm"
                  />
                </div>

                {/* Texto con animación de slide */}
                <div className={`
                  flex flex-col z-10 min-w-0
                  transition-all duration-500 ease-out
                  ${isOpen
                    ? 'w-auto opacity-100 translate-x-0'
                    : 'w-0 opacity-0 -translate-x-8'
                  }
                `}>
                  <span className="font-semibold text-base leading-tight truncate">
                    {role.displayName}
                  </span>
                  {/* <span className={`
                    text-xs mt-1.5 truncate transition-colors duration-300
                    ${isActive ? 'text-white/90' : 'text-gray-500'}
                  `}>
                    {role.description}
                  </span> */}
                </div>

                {/* Active indicator dot */}
                {isActive && isOpen && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Divider elegante */}
        <div className="relative w-full h-px my-4">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-300/60 to-transparent" />
        </div>

        {/* Footer / Usuario */}
        <div className="mt-auto relative w-full flex flex-col items-center" ref={userMenuRef}>

          {/* Menú Flotante con backdrop blur */}
          <div className={`
            absolute bottom-full left-0 right-0 mb-3 
            bg-white/95 backdrop-blur-xl border border-gray-200/80
            rounded-2xl shadow-2xl shadow-gray-900/10 p-2.5 z-20 
            transition-all duration-400 ease-out origin-bottom
            ${showUserMenu
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
            }
          `}>
            <button
              onClick={onLogout}
              className="
                w-full flex items-center gap-3 px-4 py-3.5
                text-red-600 font-semibold
                hover:bg-linear-to-r hover:from-red-50 hover:to-red-100/50
                rounded-xl transition-all duration-300
                group
              "
            >
              <MdLogout size={22} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              <span className="text-sm">Cerrar sesión</span>
            </button>
          </div>

          {/* Botón Logout Colapsado con efecto glow */}
          <button
            onClick={onLogout}
            className={`
              flex items-center justify-center rounded-2xl
              bg-linear-to-br from-red-500 to-red-600
              text-white shadow-lg shadow-red-500/30
              hover:shadow-xl hover:shadow-red-500/40 hover:scale-105
              active:scale-95
              transition-all duration-300
              ${isOpen
                ? 'h-0 w-0 opacity-0 scale-75 mb-0 pointer-events-none'
                : 'w-16 h-16 mb-5 opacity-100 scale-100'
              }
            `}
            title="Cerrar sesión"
          >
            <MdLogout size={26} className="drop-shadow-sm" />
          </button>

          {/* Tarjeta de Usuario Premium */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`
              relative flex items-center cursor-pointer select-none overflow-hidden
              bg-linear-to-r from-[#c93a3a] via-[#b83232] to-[#a02828]
              hover:from-[#d44444] hover:via-[#c93a3a] hover:to-[#b83232]
              shadow-lg shadow-red-900/20
              hover:shadow-xl hover:shadow-red-900/30
              active:scale-95
              transition-all duration-500 ease-out
              ${isOpen
                ? 'w-full p-3.5 rounded-2xl gap-3'
                : 'w-14 h-14 justify-center p-0 rounded-full'
              }
            `}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Avatar con ring animado */}
            <div className={`
              relative bg-white text-[#b83232] flex items-center justify-center 
              font-bold shadow-md ring-2 ring-white/50
              transition-all duration-500 ease-out
              ${isOpen
                ? 'w-11 h-11 rounded-full text-base'
                : 'w-14 h-14 rounded-full text-xl'
              }
            `}>
              <span className="relative z-10">{userName.charAt(0).toUpperCase()}</span>
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-red-100/50 to-transparent" />
            </div>

            {/* Detalles del usuario */}
            <div className={`
              flex flex-col min-w-0 flex-1
              transition-all duration-500 ease-out
              ${isOpen
                ? 'w-auto opacity-100 translate-x-0'
                : 'w-0 opacity-0 -translate-x-4'
              }
            `}>
              <span className="text-sm font-bold text-white truncate drop-shadow-sm">
                {userName}
              </span>
              <span className="text-xs text-white/80 truncate">
                {userRole}
              </span>
            </div>

            {/* Chevron con rotación */}
            <div className={`
              text-white/90
              transition-all duration-500 ease-out
              ${isOpen
                ? 'w-auto opacity-100 translate-x-0'
                : 'w-0 opacity-0 translate-x-4'
              }
            `}>
              <MdChevronRight
                size={22}
                className={`
                  transition-transform duration-500 ease-out
                  ${showUserMenu ? '-rotate-90' : 'rotate-0'}
                `}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style >{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d1d5db 0%, #9ca3af 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;