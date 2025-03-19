"use client";

import { useEffect, useRef, useState } from "react";

export default function TakeScreenShot() {
  const intervalRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [settings, setSettings] = useState({
    sleepingThreshold: 0,
    idleThreshold: 0,
    screenshotThreshold: 0,
});

  const captureAndSendScreenshot = async (employeeId) => {
    try {
      const track = mediaStream?.getVideoTracks()[0];
      if (!track) return;
      localStorage.setItem("permissionToShare", "true");

      const imageCapture = new ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();

      // Convert bitmap to a canvas
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(bitmap, 0, 0);

      // Convert to Base64
      const screenshot = canvas.toDataURL("image/png");

      // Send screenshot to API
      const response = await fetch("/employerAPI/screenShot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, screenCapture: screenshot }),
      });

      const data = await response.json();
      console.log("Screenshot sent:", data.message);
    } catch (error) {
      //console.error("Error capturing or sending screenshot:", error);
    }
  };

  const stopCapture = () => {
    localStorage.removeItem("permissionToShare");

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("Screenshot capturing stopped.");
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
      console.log("Media stream stopped.");
    }
  };

      const fetchConfig = async () => {
          const configSettings = await fetch("/employerAPI/configSettings/");
          const configData = await configSettings.json();
      
          if (configData && Array.isArray(configData)) {
              const sleepingThreshold = configData.find(item => item.name === "sleepingThreshold")?.threshold || 1;
              const idleThreshold = configData.find(item => item.name === "idleThreshold")?.threshold || 1;
              const screenshotThreshold = configData.find(item => item.name === "screenShotThreshold")?.threshold || 1;
      
              setSettings({
                  sleepingThreshold,
                  idleThreshold,
                  screenshotThreshold
              });
          }
      };
      

  useEffect(() => {
    const startCapture = async () => {
        if (user && user.role === "EMPLOYEE") {
            console.log("User role:", user.role);

            // Only request media stream if it's not already active
            if (!mediaStream) {
                try {
                    const stream = await navigator.mediaDevices.getDisplayMedia({
                        video: { mediaSource: "screen" },
                    });
                    setMediaStream(stream);
                    const track = stream.getVideoTracks()[0];
                    console.log("User selected:", track.getSettings().displaySurface);
                    localStorage.setItem("permissionToShare", "true");
                    track.addEventListener("ended", () => {
                        console.log("User stopped screen sharing.");
                        setMediaStream(null);
                        
                        stopCapture();
                        console.log("deleting permission here 2")
                    });
                } catch (error) {
                   // console.error("Error accessing display media:", error);
                    console.log(mediaStream);
                    localStorage.setItem("permissionToShare", "false");
                }
            }
            if(mediaStream){
              localStorage.setItem("permissionToShare", "true");
            }
            console.log(settings.screenshotThreshold,"screenshot threshold")
            // Start capturing every 10 seconds
            intervalRef.current = setInterval(() => {
                if (!localStorage.getItem("user")) {
                    stopCapture();
                    console.log("deleting permission here 1")
                } else {
                    captureAndSendScreenshot(user.employeeId);
                    
                }
            }, settings.screenshotThreshold);
        } else {
            stopCapture();
            console.log("deleting permission here 4")
        }
    };
    fetchConfig();
    startCapture();

    const handleStorageChange = () => {
        const updatedUser = JSON.parse(localStorage.getItem("user") || "null");
        setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
        stopCapture();
        console.log("deleting permission here 5")
        window.removeEventListener("storage", handleStorageChange);
    };
}, [user, mediaStream]);


  return null;
}

