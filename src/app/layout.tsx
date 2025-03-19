"use client"; // ✅ Add this at the top

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CameraProvider } from "@/app/(frontend)/(employee)/context/CameraContext";
import TakeScreenShot from "@/app/components/takeScreenShot";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const setToken = localStorage.setItem("tokenRef" ,"true")

    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse the stored JSON
        const employeeId = parsedUser.employeeId;

        const fetchStatus = async () => {
          try {
            const response = await fetch("/employerAPI/getEmployeeStatus", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await response.json();
            console.log("Fetched Employee Status:", data);
          } catch (error) {
            console.error("Error fetching status:", error);
          }
        };

        const ifCheckIn = async () => {
          const permission = localStorage.getItem("permissionToShare");

          console.log(permission + ' permission here');

          if (permission === "false") {
            setCheckedIn(false);
          } else {
            try {
              const empResponse = await fetch(`/employerAPI/ifCheckIn?employeeId=${employeeId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              const data = await empResponse.json();
              console.log(data, 'data here');

              if (data.employees != null) {
                console.log("test here if null");
                setCheckedIn(true);
              }
              console.log("Check-in status:", data);
            } catch (error) {
              console.error("Error checking in:", error);
            }
          }
        };

        fetchStatus();
        ifCheckIn(); // Call the function

        const interval = setInterval(() => {
          fetchStatus();
          ifCheckIn();
        }, 10000);

        return () => clearInterval(interval); // Cleanup on unmount
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []); // Ensure this effect runs only once on mount

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CameraProvider>
          {/* {checkedIn && <TakeScreenShot />} Render component conditionally */}
          {children}
        </CameraProvider>
      </body>
    </html>
  );
}
