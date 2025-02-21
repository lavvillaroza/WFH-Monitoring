"use client";

import Navbar from "@/app/navbar/page";
import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const ActivityMonitoring = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [drowsinessStatus, setDrowsinessStatus] = useState("Analyzing...");
  const [alertLog, setAlertLog] = useState<{ timestamp: string; activity: string }[]>([]);
  const [drowsyCount, setDrowsyCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };

    loadModels();

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
    startCamera();

    const detectFace = async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detections.length > 0) {
          const landmarks = detections[0].landmarks;
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const eyeClosed = isEyeClosed(leftEye) && isEyeClosed(rightEye);

          if (eyeClosed) {
            setDrowsinessStatus("Sleeping");
            setDrowsyCount(prev => prev + 1);
            addLog("Eyes closed detected");
          } else {
            setDrowsinessStatus("Awake");
            setDrowsyCount(0);
            addLog("User is alert");
          }
        } else {
          setDrowsinessStatus("Out of frame");
          addLog("User out of camera view");
        }
      }
    };

    const isEyeClosed = (eye: faceapi.Point[]) => {
      const verticalDistance = Math.abs(eye[1].y - eye[5].y);
      const horizontalDistance = Math.abs(eye[0].x - eye[3].x);
      return verticalDistance / horizontalDistance < 0.2;
    };

    const addLog = (activity: string) => {
      const newLog = {
        timestamp: new Date().toLocaleTimeString(),
        activity,
      };
      setAlertLog(prevLogs => [newLog, ...prevLogs.slice(0, 1000)]);
    };

    const faceTrackingInterval = setInterval(detectFace, 500);

    return () => {
      clearInterval(faceTrackingInterval);
    };
  }, []);

  useEffect(() => {
    if (drowsyCount >= 5) {
      setShowModal(true);
      setDrowsyCount(0);
    }
  }, [drowsyCount]);
  const getStatusColor = () => {
    switch (drowsinessStatus) {
      case "Awake": return "text-green-500";
      case "Drowsy": return "text-yellow-500";
      case "Analyzing...": return "text-blue-500";
      default: return "text-blue-500";
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-white-900 shadow-xl text-black p-6 rounded-lg">
              <h2 className="text-xl font-semibold">HUMAN ACTIVITY RECOGNITION</h2>
              <p className="mt-2 text-sm text-gray-300">Alertness Report & Real-Time Alert Log.</p>
              <div className="mt-4 p-3 bg-gray-100 rounded-lg h-80 overflow-auto text-sm">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Real-Time Log:</h3>
                {alertLog.map((log, index) => (
                  <p key={index} className="text-gray-600">
                    <span className="font-semibold">{log.timestamp}:</span> {log.activity}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-white-900 shadow-xl text-black p-6 rounded-lg">
              <h2 className="text-xl font-semibold">WAKEFULNESS DETECTION</h2>
              <p className="mt-2 text-sm text-gray-300">Live monitoring for drowsiness detection.</p>

              <div className="mt-4 flex justify-center relative">
                <video ref={videoRef} autoPlay playsInline className="w-80 h-80 border rounded-md shadow-md" />
              </div>

              <p className="mt-4 text-lg font-semibold text-center">
                Status: <span className={`${getStatusColor()}`}>{drowsinessStatus}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Take a Break</h2>
            <p className="mt-2">You have been drowsy for too long. Please take a break!</p>
            <button onClick={() => setShowModal(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityMonitoring;
