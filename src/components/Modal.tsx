import { useEffect } from "react";
import type React from "react";
import { playSound } from "@/utils/gameHelpers";

type ModalProps = {
  title: string;
  content?: React.ReactNode;
  buttonText?: string;
  onClick?: () => void;
  soundEffect?: string;
}

export default function Modal({ title, content, buttonText, onClick, soundEffect }: ModalProps) {
  
  useEffect(() => {
    if (soundEffect) {
      playSound(soundEffect);
    }
  }, [soundEffect]);
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h2>{title}</h2>}
        {content}

        {buttonText && onClick && <button onClick={onClick}>{buttonText}</button>}
      </div>
    </div>
  );
}
