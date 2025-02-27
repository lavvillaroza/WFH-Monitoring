"use client";
import { createContext, useState, useEffect, useRef, ReactNode } from "react";

interface CameraContextType {
  videoRef: React.RefObject<HTMLVideoElement>;
  startCamera: () => void;
  stopCamera: () => void;
}

export const CameraContext = createContext<CameraContextType | null>(null);

export const CameraProvider = ({ children }: { children: ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
            console.log(`Stopping track: ${track.kind}`); // Debugging log
            track.stop();
        });
        videoRef.current.srcObject = null;
        console.log("Camera stopped.");
    } else {
        console.log("No active camera stream found.");
    }
};

  return (
    <CameraContext.Provider value={{ videoRef, startCamera, stopCamera }}>
      {children}
    </CameraContext.Provider>
  );
};
