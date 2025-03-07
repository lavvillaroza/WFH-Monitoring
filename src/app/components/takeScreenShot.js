"use client";

import { useEffect, useRef } from "react";
import html2canvas from "html2canvas-pro";

export default function TakeScreenShot() {
  const intervalRef = useRef(null);

  const captureAndSendScreenshot = async (employeeId) => {
    try {
      document.body.style.color = "#000";
      document.body.style.backgroundColor = "#fff";

      const screenshotTarget = document.body;
      const canvas = await html2canvas(screenshotTarget, {
        backgroundColor: null,
        useCORS: true,
      });

      const screenshot = canvas.toDataURL("image/png");

      const response = await fetch("/employerAPI/screenShot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, screenCapture: screenshot }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error capturing or sending screenshot:", error);
    }
  };

  useEffect(() => {
    const startCapture = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userObject = JSON.parse(storedUser);
        const role = userObject.role;
        const empId = userObject.employeeId;

        if (role === "EMPLOYEE") {
          console.log("User role:", role);

          intervalRef.current = setInterval(() => {
            console.log("Capturing and sending screenshot...");
            captureAndSendScreenshot(empId);
          }, 5000);
        }
      }
    };

    const stopCapture = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("Screenshot capturing stopped.");
      }
    };

    startCapture();

    const handleStorageChange = () => {
      if (!localStorage.getItem("user")) {
        stopCapture();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      stopCapture();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return null;
}
