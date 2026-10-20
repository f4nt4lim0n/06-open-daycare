import { useEffect, useState } from 'react';
import { PARENT_ROLES, ParentRole } from '@/app/_data/kids';
import { CloseIcon, InfoIcon, SendIcon } from '@/components/shared/icons';

interface LinkParentModalProps {
  kidFullName: string;
  kidFirstName: string;
  onClose: () => void;
  onInvite: (invite: { name: string; email: string; role: ParentRole }) => void;
}

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const INVITE_CODE = '7K4P9';

const LABEL_STYLE = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.7,
  color: '#94887B',
} as const;

const INPUT_STYLE = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 14,
  border: '1.5px solid #EADFD0',
  background: '#fff',
  fontSize: 15,
  color: '#3F362E',
} as const;

interface FieldErrors {
  name?: string;
  email?: string;
}

export function LinkParentModal({ kidFullName, kidFirstName, onClose, onInvite }: LinkParentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ParentRole>('Mamá');
  const [errors, setErrors] = useState<FieldErrors>({});

  // Escape cierra el modal descartando lo escrito, y el body no scrollea mientras está abierto.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();

    const nextErrors: FieldErrors = {};
    if (!nameTrimmed) nextErrors.name = 'El nombre es requerido';
    if (!emailTrimmed) {
      nextErrors.email = 'El email es requerido';
    } else if (!EMAIL_REGEX.test(emailTrimmed)) {
      nextErrors.email = 'Formato de email inválido';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onInvite({ name: nameTrimmed, email: emailTrimmed, role });
    onClose();
  };

  // Solo el click directo sobre el overlay (no sobre la tarjeta) cierra.
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(63,54,46,.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Vincular padre"
        style={{
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#FBF4EC',
          border: '1px solid #ECE0D0',
          borderRadius: '24px',
          boxShadow: '0 20px 50px -24px rgba(63,54,46,.35)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', borderBottom: '1px solid #ECE0D0' }}>
          <div>
            <div style={{ fontFamily: "'Fredoka'", fontWeight: 600, fontSize: 18, color: '#3F362E' }}>Vincular padre</div>
            <div style={{ fontSize: 13, color: '#A89A8B' }}>a {kidFullName}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: '#F0E6D8',
              color: '#94887B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <CloseIcon className="w-[18px] h-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ padding: '22px 26px' }}>
          {/* Aviso azul */}
          <div style={{ display: 'flex', gap: 11, background: '#E3ECFB', borderRadius: 14, padding: '13px 16px', marginBottom: 20 }}>
            <InfoIcon className="w-5 h-5" style={{ flex: 'none', marginTop: '1px', color: '#4E72C8' }} />
            <span style={{ fontSize: 13.5, color: '#3F5694', lineHeight: 1.45 }}>
              Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {kidFirstName}.
            </span>
          </div>

          {/* Nombre del padre/madre */}
          <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>NOMBRE DEL PADRE/MADRE</div>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Diego Fernández"
            style={{ ...INPUT_STYLE, marginBottom: errors.name ? 8 : 18 }}
          />
          {errors.name && (
            <div style={{ color: '#DC3545', fontSize: 12.5, fontWeight: 700, marginBottom: 18 }}>
              {errors.name}
            </div>
          )}

          {/* Email */}
          <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>EMAIL</div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            style={{ ...INPUT_STYLE, marginBottom: errors.email ? 8 : 18 }}
          />
          {errors.email && (
            <div style={{ color: '#DC3545', fontSize: 12.5, fontWeight: 700, marginBottom: 18 }}>
              {errors.email}
            </div>
          )}

          {/* Parentesco */}
          <div style={{ ...LABEL_STYLE, marginBottom: 10 }}>PARENTESCO</div>
          <div style={{ display: 'flex', gap: 9, marginBottom: 20 }}>
            {PARENT_ROLES.map((option) => {
              const isSelected = role === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setRole(option)}
                  style={{
                    flex: 1,
                    padding: 11,
                    borderRadius: 999,
                    border: `1.5px solid ${isSelected ? '#9FB8EC' : '#ECE0D0'}`,
                    background: isSelected ? '#CCD8F4' : '#FFFDF9',
                    color: isSelected ? '#4E72C8' : '#6E6359',
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Código de invitación (mock fijo) */}
          <div style={{ background: '#FBF1D6', border: '1.5px dashed #E6D08A', borderRadius: 16, padding: 18, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ ...LABEL_STYLE, color: '#A88526', marginBottom: 8 }}>CÓDIGO DE INVITACIÓN</div>
            <div style={{ fontFamily: "'Fredoka'", fontWeight: 600, fontSize: 34, letterSpacing: 7, color: '#8A7234' }}>
              {INVITE_CODE}
            </div>
            <div style={{ fontSize: 13, color: '#A88526', marginTop: 6 }}>Vence en 7 días</div>
          </div>

          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              width: '100%',
              padding: 14,
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(180deg,#F4977E,#EE8164)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15.5,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '0 10px 22px -8px rgba(238,129,100,.7)',
            }}
          >
            <SendIcon className="w-[19px] h-[19px]" />
            <span>Enviar invitación</span>
          </button>
        </form>
      </div>
    </div>
  );
}
