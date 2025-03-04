"use client";

import Navbar from "@/app/navbar/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ActivityMonitoring = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<{ activity: string; timestamp: string }[]>([]);
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/"); // Redirect if not logged in
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Use SSE to listen for real-time updates
    const eventSource = new EventSource(`/employeeAPI/humanActivityLog?userId=${userId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setActivityLogs(data); // Update UI with latest logs
      } catch (error) {
        console.error("❌ Error parsing activity logs:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("❌ SSE connection error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            {/* Human Activity Recognition */}
            <div className="bg-white shadow-xl text-black p-6 rounded-lg">
              <h2 className="text-xl font-semibold">HUMAN ACTIVITY RECOGNITION</h2>
              <p className="mt-2 text-sm text-gray-500">Alertness Report & Real-Time Alert Log.</p>
              <div className="mt-4 p-3 bg-gray-100 rounded-lg h-80 overflow-auto text-sm">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Real-Time Log:</h3>
                <ul className="space-y-2">
                  {activityLogs.length > 0 ? (
                    activityLogs.map((log, index) => (
                      <li key={index}>
                        <span className="font-medium">{log.activity}</span> 
                        <span className="text-gray-500 text-xs ml-2">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No logs available.</p>
                  )}
                </ul>
              </div>
            </div>
 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityMonitoring;
