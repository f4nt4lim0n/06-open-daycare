"use client";

import { useEffect, useState } from "react";
import { useFeed } from "@/components/shared/FeedProvider";
import {
  PostType,
  POST_TYPE_LABEL,
  POST_TYPE_STYLE,
  POST_TYPES,
  ROOM_AUDIENCE_ID,
} from "@/app/_data/mock";
import { getComposerKids, COMPOSER_KID_IDS } from "@/app/_data/kids";

const DEFAULT_AUDIENCE_ID = "mateo-fernandez";
const DEFAULT_TYPE: PostType = "meal";

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewPostModal({ isOpen, onClose }: NewPostModalProps) {
  const { publishPost } = useFeed();
  const [audienceId, setAudienceId] = useState<string>(DEFAULT_AUDIENCE_ID);
  const [type, setType] = useState<PostType>(DEFAULT_TYPE);
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Escape cierra el modal; el body no scrollea mientras está abierto.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const selectAudience = (id: string) => {
    setAudienceId(id);
    setError(null);
  };

  const selectType = (nextType: PostType) => {
    setType(nextType);
    setError(null);
  };

  const handleClose = () => {
    setError(null);
    setText("");
    setAudienceId(DEFAULT_AUDIENCE_ID);
    setType(DEFAULT_TYPE);
    onClose();
  };

  const handlePublish = () => {
    // Validación: descripción no vacía, audiencia y tipo seleccionados
    if (!text.trim()) {
      setError("La descripción es requerida");
      return;
    }
    if (
      !COMPOSER_KID_IDS.includes(audienceId) &&
      audienceId !== ROOM_AUDIENCE_ID
    ) {
      setError("Selecciona un niño o 'Toda la sala'");
      return;
    }
    if (!type) {
      setError("Selecciona un tipo");
      return;
    }

    publishPost({ audienceId, type, text });
    handleClose();
  };

  if (!isOpen) return null;

  const kids = getComposerKids();

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Nueva publicación"
        className="w-full max-w-[580px]"
        style={{
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          background: "#FBF4EC",
          border: "1px solid #ECE0D0",
          borderRadius: "24px",
          boxShadow: "0 20px 50px -24px rgba(63,54,46,.35)",
        }}
      >
        {/* Header: Cancelar | Nueva publicación | Publicar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "20px 26px",
            borderBottom: "1px solid #ECE0D0",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            style={{
              justifySelf: "start",
              background: "none",
              border: "none",
              padding: 0,
              color: "#94887B",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <span
            className="font-head"
            style={{
              fontWeight: 600,
              fontSize: "18px",
              color: "#3F362E",
            }}
          >
            Nueva publicación
          </span>
          <button
            type="button"
            onClick={handlePublish}
            style={{
              justifySelf: "end",
              background: "none",
              border: "none",
              padding: 0,
              color: "#D9583C",
              fontWeight: 800,
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Publicar
          </button>
        </div>

        <div style={{ padding: "24px 26px" }} className="space-y-[22px]">
          {/* Sección PARA */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: ".7px",
                color: "#94887B",
                marginBottom: "10px",
              }}
            >
              PARA
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "9px" }}>
              {kids.map((kid) => {
                const isSelected = audienceId === kid.id;
                return (
                  <button
                    key={kid.id}
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px 6px 6px",
                      borderRadius: "999px",
                      border: `1.5px solid ${isSelected ? "#3F362E" : "#ECE0D0"}`,
                      background: isSelected ? "#3F362E" : "#FFFDF9",
                      color: isSelected ? "#FFFFFF" : "#6E6359",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    onClick={() => selectAudience(kid.id)}
                    aria-pressed={isSelected}
                  >
                    <span
                      className="font-head"
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: kid.avatarBg,
                        color: kid.avatarColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      {kid.initial}
                    </span>
                    {kid.firstName}
                  </button>
                );
              })}
              <button
                type="button"
                style={{
                  padding: "6px 16px",
                  borderRadius: "999px",
                  border: "1.5px solid #ECE0D0",
                  background: "#FFFDF9",
                  color: "#6E6359",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => selectAudience(ROOM_AUDIENCE_ID)}
                aria-pressed={audienceId === ROOM_AUDIENCE_ID}
              >
                Toda la sala
              </button>
            </div>
          </div>

          {/* Sección TIPO */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: ".7px",
                color: "#94887B",
                marginBottom: "10px",
              }}
            >
              TIPO
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "9px" }}>
              {POST_TYPES.map((t: PostType) => {
                const style = POST_TYPE_STYLE[t];
                const isSelected = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "999px",
                      border: "none",
                      background: style.solid,
                      color: style.solidText,
                      fontWeight: 800,
                      fontSize: "13.5px",
                      cursor: "pointer",
                      opacity: isSelected ? 1 : 0.5,
                      boxShadow: isSelected ? "0 0 0 2px #3F362E" : "none",
                    }}
                    onClick={() => selectType(t)}
                    aria-pressed={isSelected}
                  >
                    {POST_TYPE_LABEL[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sección DESCRIPCIÓN */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: ".7px",
                color: "#94887B",
                marginBottom: "10px",
              }}
            >
              DESCRIPCIÓN
            </div>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contá cómo le fue hoy…"
              className="placeholder:text-[#B6A99B]"
              style={{
                width: "100%",
                minHeight: "120px",
                resize: "vertical",
                borderRadius: "14px",
                border: "1.5px solid #EADFD0",
                background: "#fff",
                padding: "14px 16px",
                fontSize: "15px",
                color: "#3F362E",
                lineHeight: 1.5,
              }}
            />
            {error && (
              <p
                role="alert"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#D9583C",
                  marginTop: "8px",
                  marginBottom: 0,
                }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Sección FOTOS (placeholder visual, sin upload) */}
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "14px",
                background: "#F4ECE1",
                border: "1px solid #ECE0D0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#CBB89F",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
              </svg>
            </div>
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "14px",
                border: "1.5px dashed #DBCDBA",
                background: "#F4ECE1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: "#B0A290",
                cursor: "pointer",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C5503A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span style={{ fontSize: "12px" }}>Agregar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
