import styled from 'styled-components';
import type { Activity } from '../types';

interface ActivityDetailModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (activity: Activity) => void;
}

export const ActivityDetailModal = ({ activity, isOpen, onClose, onSave }: ActivityDetailModalProps) => {
  if (!isOpen || !activity) return null;

  const handleSave = () => {
    if (onSave && activity) {
      onSave(activity);
    }
    onClose();
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateHours = () => {
    const start = typeof activity.startTime === 'string' ? new Date(activity.startTime) : activity.startTime;
    const end = typeof activity.endTime === 'string' ? new Date(activity.endTime) : activity.endTime;
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')} hrs realizadas`;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Actividad {activity.id}</Title>
          <HoursTag>{calculateHours()}</HoursTag>
        </ModalHeader>

        <FormGroup>
          <Label>Descripción de la actividad</Label>
          <TextArea
            value={activity.description}
            placeholder="Aquí el usuario debe indicar la actividad que ha realizado"
            readOnly
          />
        </FormGroup>

        <TimeRow>
          <FormGroup>
            <Label>Hora inicio</Label>
            <TimeInput>
              <ClockIcon>🕐</ClockIcon>
              <TimeValue>{formatTime(activity.startTime)}</TimeValue>
            </TimeInput>
          </FormGroup>

          <ArrowIcon>→</ArrowIcon>

          <FormGroup>
            <Label>Hora inicio</Label>
            <TimeInput>
              <ClockIcon>🕐</ClockIcon>
              <TimeValue>{formatTime(activity.endTime)}</TimeValue>
            </TimeInput>
          </FormGroup>
        </TimeRow>

        <FormGroup>
          <Label>Subir evidencias (opcional)</Label>
          <EvidenceContainer>
            <EvidenceBox />
            <EvidenceBox />
            <EvidenceBox />
          </EvidenceContainer>
          <UploadButton>
            <UploadIcon>☁️</UploadIcon>
            Clic para subir evidencias
          </UploadButton>
        </FormGroup>

        <SaveButton onClick={handleSave}>
          Guardar cambios
        </SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
`;

const HoursTag = styled.span`
  padding: 8px 16px;
  background-color: #e5e5e5;
  color: #4a4a4a;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #4a4a4a;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4a4a4a;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TimeRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;

  > ${FormGroup} {
    flex: 1;
    margin-bottom: 0;
  }
`;

const ArrowIcon = styled.div`
  font-size: 24px;
  color: #4a4a4a;
  margin-bottom: 12px;
`;

const TimeInput = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const ClockIcon = styled.span`
  font-size: 20px;
`;

const TimeValue = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const EvidenceContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
`;

const EvidenceBox = styled.div`
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const UploadButton = styled.button`
  width: 100%;
  padding: 16px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background-color: white;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    border-color: #9ca3af;
    background-color: #f9fafb;
  }
`;

const UploadIcon = styled.span`
  font-size: 20px;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #4a4a4a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #333333;
  }

  &:active {
    transform: scale(0.98);
  }
`;
