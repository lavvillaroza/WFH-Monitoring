"use client";
import { createContext, useState, useRef, useEffect, ReactNode } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import TrackerModal from "../(timeKeeping)/modals/tracker-form/page";

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
  const [faceMatcher, setFaceMatcher] = useState<any>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceapi, setFaceApi] = useState<any>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const cameraStartedRef = useRef(false); // Ensures camera starts only once
  const [isLarge, setIsLarge] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [outOfAreaCount, setOutOfAreaCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const loggedActivitiesMap = new Map<string, { count: number; lastLoggedTime: number }>(); // Track count & timestamp
  const logCooldown = 5000;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userResponseRef = useRef(false);
  const [modalTimer, setModalTimer] = useState(10);
  const [employeeId,setEmployeeId] = useState("");


  const handleModalResponse = async (response: boolean) => {
    userResponseRef.current = response;
    setIsModalOpen(false); // Close modal

    if (response) {
      logActivity("User is back");
      setOutOfAreaCount(0);
      return;
    } else {
      stopCamera(); // Stop camera when user is out of area
  
      const timestamp = new Date().toISOString();
      const requestBody = {
        userId,
        timeOut: timestamp,
        remarks: "User is out of area",
      };
  
      try {
        const response = await fetch("/employeeAPI/dtr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          throw new Error("Failed to log timeout");
        }
        logActivity("User out of area. Force to logout!");
        window.location.reload();
        console.log("✅ Timeout logged successfully");
      } catch (error) {
        console.error("❌ Error logging timeout:", error);
      }
    }
  };
  
  
  // Start countdown when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setModalTimer(10); // Reset timer to 60 seconds
  
      const interval = setInterval(() => {
        setModalTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleModalResponse(false); // Auto-close modal & stop camera if no response

            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [isModalOpen]);
  
  useEffect(() => {
    if (outOfAreaCount >= 10 && !isModalOpen) { // 60 seconds threshold
      setIsModalOpen(true);
      userResponseRef.current = false;
  
      modalTimeoutRef.current = setTimeout(() => {
        if (!userResponseRef.current) {
          stopCamera();
        }
      }, 60000);
    }
  }, [outOfAreaCount]);


  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth - 120 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 100 : 0,
  }));

  useEffect(() => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setEmployeeId(user.employeeId)
        setUserId(user?.id || null);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }
}, []);

const logActivity = async (activity: string) => {
  if (!userId) {
    console.warn("User ID not found. Skipping log.");
    return;
  }

  const currentTime = Date.now();
  const activityData = loggedActivitiesMap.get(activity) || { count: 0, lastLoggedTime: 0 };

  if (currentTime - activityData.lastLoggedTime < logCooldown) {
    console.log(`⏳ Skipping duplicate log for: ${activity}`);
    return; // Skip logging if within cooldown
  }

  try {
    const response = await fetch("/employeeAPI/humanActivityLog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, activity,employeeId, count: activityData.count + 1 }),
    });

    if (!response.ok) {
      throw new Error("Failed to log activity");
    }

    console.log(`✅ Activity logged: ${activity} (Count: ${activityData.count + 1})`);
    loggedActivitiesMap.set(activity, { count: activityData.count + 1, lastLoggedTime: currentTime });

  } catch (error) {
    console.error("❌ Error logging activity:", error);
  }
};
  

  const toggleSize = () => {
    setIsLarge((prev) => {
      const newSize = !prev;
      if (newSize) {
        // Center the video when enlarged
        setPosition({
          x: (window.innerWidth - 200) / 2,
          y: (window.innerHeight - 200) / 2,
        });
      }
      else{
        setPosition((prev) => ({
          x: Math.min(prev.x, window.innerWidth - 150),
          y: Math.min(prev.y, window.innerHeight - 120),
        }));
      }
      return newSize;
    });
  };

useEffect(() => {
  const updatePosition = () => {
    setPosition((prev) => ({
      x: Math.min(prev.x, window.innerWidth - 150),
      y: Math.min(prev.y, window.innerHeight - 120),
    }));
  };

  window.addEventListener("resize", updatePosition);
  return () => window.removeEventListener("resize", updatePosition);
}, []);
  

  // Dragging functions
  const startDrag = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onDrag = (e: MouseEvent) => {
    if (!dragging) return;
  
    setPosition((prev) => ({
      x: Math.max(0, Math.min(e.clientX - offset.x, window.innerWidth - 150)), // Prevents going outside horizontally
      y: Math.max(0, Math.min(e.clientY - offset.y, window.innerHeight - 120)), // Prevents going outside vertically
    }));
  };
  
  const stopDrag = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging]);

  // Load face-api models
  useEffect(() => {
    const initFaceApi = async () => {
      try {
        const faceApiModule = await import("@vladmandic/face-api");
        setFaceApi(faceApiModule);

        await tf.setBackend("webgl");
        await tf.ready();
       // console.log("✅ TensorFlow.js initialized with WebGL backend");

        await loadModels(faceApiModule);
        const matcher = await loadLabeledImages(faceApiModule);
        if (matcher) setFaceMatcher(matcher);

        setModelsLoaded(true);
      } catch (error) {
        console.error("❌ Error initializing Face API:", error);
      }
    };

    initFaceApi();
  }, []);

  const loadModels = async (faceApi: any) => {
    try {
      await faceApi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceApi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceApi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceApi.nets.ssdMobilenetv1.loadFromUri("/models");
     // console.log("✅ Face API models loaded successfully");
    } catch (error) {
      console.error("❌ Error loading Face API models:", error);
    }
  };

  const loadLabeledImages = async (faceApi: any) => {
    try {
      const label = "Jaykko Takahashi";
      const img = await faceApi.fetchImage("/models/faces/jaykko.jpg");

      const detection = await faceApi
        .detectSingleFace(img, new faceApi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        console.warn("⚠️ Face not detected in reference image.");
        logActivity("Face not detected in reference image.");
        return null;
      }

      return new faceApi.FaceMatcher(
        [new faceApi.LabeledFaceDescriptors(label, [detection.descriptor])],
        0.6
      );
    } catch (error) {
      console.error("❌ Error loading labeled images:", error);
      return null;
    }
  };

  // Camera Controls
  const startCamera = async () => {
    try {
      if (cameraStartedRef.current) return; // Prevent multiple starts
  
      console.log("🎥 Checking camera permissions...");
      const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
  
      if (permissionStatus.state === "denied") {
        console.error("❌ Camera access denied by user.");
        return;
      }
  
      console.log("🎥 Starting camera...");
      
      // Ensure previous stream is stopped before starting a new one
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
  
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
  
      setStream(newStream);
      cameraStartedRef.current = true;
  
      // Assign stream to video element only if it's available
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      } else {
        console.warn("⚠️ Video element is not yet mounted.");
      }
    } catch (error) {
      console.error("❌ Error accessing camera:", error);
    }
  };
  

  const stopCamera = () => {
    if (stream) {
      console.log("🛑 Stopping camera...");
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      cameraStartedRef.current = false;
    }
  };

  // Face detection logic
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
     // console.log("🎥 Camera stream set to video element.");

      const interval = setInterval(detectUserState, 1000);
      return () => {
     //   console.log("🔄 Cleaning up interval...");
        clearInterval(interval);
      };
    }
  }, [stream, faceMatcher]);

  const detectUserState = async () => {
    if (!videoRef.current || !faceMatcher || !modelsLoaded || !faceapi || !canvasRef.current) return;
  
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      canvas.width = videoContainer.clientWidth;
      canvas.height = videoContainer.clientHeight;
    }
  
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  
    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
  
        if (!detection) {
          setOutOfAreaCount((prev) => {
            if (prev === 0) {
              logActivity("User out of area!"); // Log only when transitioning from 0 to 1
            }
            return prev + 1;
          });
          return;
        }
        
        if (outOfAreaCount > 0) {
          setOutOfAreaCount(0);
        }
        
  
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
  
      if (bestMatch.label === "Jaykko Takahashi") {
        console.log("✅ Welcome, Jaykko!");
      } else {
        logActivity("Unrecognized user!");
      }
  
      // Check if user is yawning
      const landmarks = detection.landmarks;
      const topLip = landmarks.getMouth()[13];
      const bottomLip = landmarks.getMouth()[19];
      const mouthHeight = bottomLip.y - topLip.y;
  
      if (mouthHeight > 20) {
        logActivity("User is yawning!");
      }
  
      // Check if eyes are closed
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();
  
      const leftEyeHeight = leftEye[1].y - leftEye[5].y;
      const leftEyeWidth = leftEye[3].x - leftEye[0].x;
      const leftEyeRatio = leftEyeHeight / leftEyeWidth;
  
      const rightEyeHeight = rightEye[1].y - rightEye[5].y;
      const rightEyeWidth = rightEye[3].x - rightEye[0].x;
      const rightEyeRatio = rightEyeHeight / rightEyeWidth;
  
      if (leftEyeRatio > -0.28 && rightEyeRatio > -0.28) {
        logActivity("User eyes are closed.");
      }
    } catch (error) {
      console.error("❌ Error detecting face:", error);
    }
  };
  
  
  
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current && videoContainerRef.current) {
        canvasRef.current.width = videoContainerRef.current.clientWidth;
        canvasRef.current.height = videoContainerRef.current.clientHeight;
      }
    };
  
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);
  

  return (
    <CameraContext.Provider value={{ videoRef, startCamera, stopCamera, stream }}>
      {children}

      {stream && (
       <div
       ref={videoContainerRef}
       title="Drag me everywhere or double click me to view larger..."
       className="fixed cursor-pointer"
       style={{
         left: `${position.x}px`,
         top: `${position.y}px`,
         width: isLarge ? "300px" : "100px",
         height: isLarge ? "280px" : "80px",
         zIndex: 1000,
       }}
       onMouseDown={startDrag}
       onDoubleClick={toggleSize} // Double-click to resize
     >
       <video
         ref={videoRef}
         autoPlay
         playsInline
         muted
         className="w-full h-full border rounded-md shadow-md bg-black"
       />
    <canvas ref={canvasRef} className="absolute top-0 left-0" />
    <TrackerModal 
        isOpen={isModalOpen} 
        onClose={() => handleModalResponse(true)} 
        refresh={() => {}} 
        setMessage={() => {}} 
        countdown={modalTimer} // Pass countdown timer
      />
     </div>
     
      )}
    </CameraContext.Provider>
  );
};
