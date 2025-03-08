"use client";

import Navbar from "@/app/navbar/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation'; // Import the annotation plugin

// Register the Chart.js components and the annotation plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin // Register the annotation plugin
);

const ActivityMonitoring = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<{ activity: string; start: string; end: string,empId:string }[]>([]);
  const [activityChart, setActivityChart] = useState<{ activity: string; start: string; end: string }[]>([]);
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const employeeId = user?.employeeId;

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/"); // Redirect if not logged in
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    // Use SSE to listen for real-time updates of activity chart data
    const eventSource = new EventSource(`/employeeAPI/humanActivityGraph?employeeId=${employeeId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setActivityChart(data);
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
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId) return;

    // Use SSE to listen for real-time updates of activity logs
    const eventSource = new EventSource(`/employeeAPI/humanActivityLog?employeeId=${employeeId}`);

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
  }, [employeeId]);

  const getChartData = () => {
    const activities = ["Active", "Idle", "Sleeping"];  // Updated order: Active, Idle, Sleeping
    const labels = Array.from({ length: (11 * 60) / 5 }, (_, i) => {
      const hour = Math.floor((i * 5) / 60) + 7;
      const minute = (i * 5) % 60;
      return `${hour}:${minute < 10 ? '0' + minute : minute}`;
    });

    const activityData = {
      total: Array((11 * 60) / 5).fill(0), // Default to Active (0) for all time slots
    };

    let lastEndIndex = -1;  // Track the last end time to fill in active time for gaps

    // Process each activity log
    activityLogs.forEach((log, idx) => {
      const startTime = new Date(log.start);
      const endTime = new Date(log.end);
      const startHour = startTime.getHours();
      const startMinute = startTime.getMinutes();
      const endHour = endTime.getHours();
      const endMinute = endTime.getMinutes();
      const activity = log.activity;

      // Only consider times between 7 AM to 5 PM
      if (startHour >= 7 && endHour <= 17) {
        // Calculate the index for the start time and end time
        const startIndex = Math.floor(((startHour - 7) * 60 + startMinute) / 5);
        const endIndex = Math.floor(((endHour - 7) * 60 + endMinute) / 5);

        // Fill any active time between the last end index and the current start index
        if (lastEndIndex >= 0 && startIndex > lastEndIndex) {
          for (let i = lastEndIndex + 1; i < startIndex; i++) {
            activityData.total[i] = 0;  // Set to Active (0) for the gap
          }
        }

        // Set the activity data based on the activity type (Active, Idle, Sleeping)
        const activityIndex = activities.indexOf(activity);

        // Set the correct y-value for each activity
        for (let i = startIndex; i <= endIndex; i++) {
          activityData.total[i] = activityIndex; // Set the activity value (0 = Active, 1 = Idle, 2 = Sleeping)
        }

        lastEndIndex = endIndex; // Update the last end index
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Activity (Total)",
          data: activityData.total,
          borderColor: "green", // Single color for all activities
          backgroundColor: "rgba(0, 128, 0, 0.2)",
          fill: false,
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <div className="bg-white shadow-xl text-black p-6 rounded-lg">
              <div className="mt-4 p-3 bg-gray-100 rounded-lg h-80">
                <Line
                  data={getChartData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false, // Disable the legend
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                          callback: function (value) {
                            const activities = ["Active", "Idle", "Sleeping"];  // Updated order: Active, Idle, Sleeping
                            return activities[Number(value)] || (value < 3 ? value : ''); // Removes '3' value from display
                          },
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Time (7:00 AM to 5:00 PM)',
                        },
                        ticks: {
                          autoSkip: true,
                          maxRotation: 90,
                          minRotation: 45,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
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
                        {new Date(log.start).toLocaleString()} -{" "}
                        {log.end ? new Date(log.end).toLocaleString() : "Ongoing"}
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
