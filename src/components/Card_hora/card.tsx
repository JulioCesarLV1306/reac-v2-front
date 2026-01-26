import styled from 'styled-components';
import { useEffect, useState } from 'react';

const Cardhora = () => {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    // Actualizar inmediatamente
    updateTime();

    // Actualizar cada segundo
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledWrapper>
      <div className="time-card">
        <span className="label ">Hora actual:</span>
        <span className="time">{time}</span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .time-card {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 12px 24px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .label {
    font-size: 16px;
    color: #333;
    font-weight: 800;
  }

  .time {
    font-size: 26px;
    color: #000;
    font-weight: 900;
    font-family: 'Inter', sans-serif;
    letter-spacing: 2px;
  }
`;

export default Cardhora;
