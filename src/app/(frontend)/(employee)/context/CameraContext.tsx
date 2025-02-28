"use client";
import { createContext, useState, useRef, useEffect, ReactNode } from "react";

interface CameraContextType {
  videoRef: React.RefObject<HTMLVideoElement>;
  startCamera: () => void;
  stopCamera: () => void;
  stream: MediaStream | null;
}

export const CameraContext = createContext<CameraContextType | null>(null);

export const CameraProvider = ({ children }: { children: ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (!stream) {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(newStream);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <CameraContext.Provider value={{ videoRef, startCamera, stopCamera, stream }}>
      {children}
    </CameraContext.Provider>
  );
};
