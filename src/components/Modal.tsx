import { useEffect } from "react";
import type React from "react";
import { playSound, stopAllSounds } from "@/utils/gameHelpers";

type ModalProps = {
  title: string;
  content?: React.ReactNode;
  buttonText?: string;
  onClick?: (param?: string) => void;
  soundEffect?: string;
}

export default function Modal({ title, content, buttonText, onClick, soundEffect }: ModalProps) {
  
  useEffect(() => {
    if (soundEffect) {
      stopAllSounds();
      playSound(soundEffect);
    }
  }, [soundEffect]);
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h2>{title}</h2>}
        {content}

        {buttonText && onClick && <button onClick={() => onClick()}>{buttonText}</button>}
      </div>
    </div>
  );
}
