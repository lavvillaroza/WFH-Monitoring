"use client";

import Navbar from "@/app/navbar/page";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useRouter } from "next/navigation";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [activityStatus, setActivityStatus] = useState("Active");
  const [wakefulnessStatus, setWakefulnessStatus] = useState("Awake");
  const [focusLevel, setFocusLevel] = useState(85);
  const [latestRequests, setLatestRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      router.push("/"); // Redirect if not logged in
    } else {
      fetchNotificationLogs();
    }
  }, []);

  const fetchNotificationLogs = async () => {
    try {
      const response = await fetch("/employeeAPI/notifications");
      const data = await response.json();

      setLatestRequests(data.latest || []);
      setPendingRequests(data.pending || []);
    } catch (error) {
      console.error("Error fetching notification logs:", error);
      setLatestRequests([]);
      setPendingRequests([]);
    }
  };

  const handleNavigation = (type: string) => {
    if (type === "DTRP") router.push("/dtrp");
    else if (type === "Overtime") router.push("/overtime");
    else if (type === "Leave") router.push("/leaves");
  };

  const donutData = {
    labels: ["Productive Tasks", "Idle Time"],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#ffca2c"],
      },
    ],
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar />
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Activity Card */}
            <div className="flex-1 bg-white shadow-lg rounded-lg p-4 text-gray-700">
              <h2 className="text-xl font-bold mb-4">Employee Activity & Productivity</h2>
              <p>
                <strong>Activity:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                    activityStatus === "Active" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {activityStatus}
                </span>
              </p>
              <p>
                <strong>Productivity:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                    focusLevel >= 70 ? "bg-green-500" : focusLevel >= 50 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                >
                  {focusLevel}%
                </span>
              </p>
              <p>
                <strong>Wakefulness:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                    wakefulnessStatus === "Awake" ? "bg-blue-500" : "bg-gray-500"
                  }`}
                >
                  {wakefulnessStatus}
                </span>
              </p>
            </div>

            {/* Quick Access */}
            <div className="card bg-white shadow-md text-black p-10">
              <h2 className="text-lg font-semibold">Quick Access</h2>
              <ul className="space-y-2">
                <li><a href="/dtr-problem" className="text-blue-500 hover:underline">Daily Time Record Problems</a></li>
                <li><a href="/leaves" className="text-blue-500 hover:underline">Leaves</a></li>
                <li><a href="/overtime" className="text-blue-500 hover:underline">Overtime</a></li>
              </ul>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            {/* Notification Logs Card */}
              <div className="card bg-white shadow-md text-black p-10">
                <h1 className="text-xl font-bold mb-4">NOTIFICATION LOGS</h1>

                {/* Latest Requests */}
                <h2 className="font-semibold text-lg ">Latest Requests</h2>
                
                <hr className="my-2 border-gray-300" />
                {latestRequests.length > 0 ? (
                  <div className="mb-4">
                    {["Leave", "Overtime", "DTRP"].map((type) => {
                      const filteredRequests = latestRequests
                        .filter((req) => req.type === type)
                        .slice(0, 2); // Show only the two most recent requests

                      return (
                        <div key={type} className="mb-3">
                          <h4 className="font-semibold text-[12px]">{type}</h4>
                          {filteredRequests.length > 0 ? (
                            <ul>
                              {filteredRequests.map((req, index) => (
                                <li
                                  key={index}
                                  onClick={() => handleNavigation(req.type)}
                                  className="text-blue-600 border-b py-2 cursor-pointer hover:text-blue-300 text-[10px]"
                                >
                                  {req.status} ({new Date(req.createdAt).toLocaleString()})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No recent {type.toLowerCase()} requests</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No recent requests</p>
                )}

                {/* Pending Requests */}
                <h3 className="font-semibold text-lg ">Pending Requests</h3>
                
                <hr className="my-2 border-gray-300" />
                {pendingRequests.length > 0 ? (
                  <div>
                    {["Leave", "Overtime", "DTRP"].map((type) => {
                      const filteredRequests = pendingRequests.filter((req) => req.type === type);

                      return (
                        <div key={type} className="mb-3">
                          <h4 className="font-semibold text-[12px]">{type}</h4>
                          {filteredRequests.length > 0 ? (
                            <ul>
                              {filteredRequests.map((req, index) => (
                                <li
                                  key={index}
                                  onClick={() => handleNavigation(req.type)}
                                  className="text-blue-600 border-b py-2 cursor-pointer hover:text-blue-300 text-[10px]"
                                >
                                  {req.status} ({new Date(req.createdAt).toLocaleString()})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No pending {type.toLowerCase()} requests</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No pending requests</p>
                )}
              </div>


            {/* Productivity vs Idle Time Card */}
            <div className="card bg-white shadow-md text-black p-10">
              <h2 className="text-xl font-bold mb-4">Productivity vs Idle Time</h2>
              <div className="w-80 h-80">
                <Doughnut data={donutData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
