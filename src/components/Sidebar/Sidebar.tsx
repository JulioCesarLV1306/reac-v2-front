import styled from 'styled-components';
import { useState } from 'react';

interface SidebarProps {
  onNavigate?: (role: 'trabajador' | 'supervisor') => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const [activeRole, setActiveRole] = useState<'trabajador' | 'supervisor'>('supervisor');
  const [isOpen, setIsOpen] = useState(true);

  const handleRoleClick = (role: 'trabajador' | 'supervisor') => {
    setActiveRole(role);
    onNavigate?.(role);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <StyledWrapper $isOpen={isOpen}>
      <div className="sidebar">
        <button className="toggle-button" onClick={toggleSidebar}>
          {isOpen ? '←' : '→'}
        </button>
        
        {isOpen && (
          <div className="sidebar-content">
            <button
              className={`role-button ${activeRole === 'trabajador' ? 'active' : ''}`}
              onClick={() => handleRoleClick('trabajador')}
            >
              Trabajador
            </button>
            <button
              className={`role-button ${activeRole === 'supervisor' ? 'active' : ''}`}
              onClick={() => handleRoleClick('supervisor')}
            >
              Supervisor
            </button>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $isOpen: boolean }>`
  .sidebar {
    width: ${props => props.$isOpen ? '280px' : '60px'};
    background-color: #ffffff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-right: 1px solid #e5e5e5;
    height: 100vh;
    transition: width 0.3s ease;
    position: relative;
  }

  .toggle-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4a4a4a;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
    align-self: ${props => props.$isOpen ? 'flex-end' : 'center'};

    &:hover {
      background-color: #333333;
    }
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    opacity: ${props => props.$isOpen ? '1' : '0'};
    transition: opacity 0.3s ease;
  }

  .role-button {
    width: 100%;
    padding: 16px 24px;
    font-size: 16px;
    font-weight: 500;
    border: 2px solid #4a4a4a;
    border-radius: 8px;
    background-color: #ffffff;
    color: #4a4a4a;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background-color: #f5f5f5;
    }

    &.active {
      background-color: #4a4a4a;
      color: #ffffff;
    }
  }
`;

export default Sidebar;
