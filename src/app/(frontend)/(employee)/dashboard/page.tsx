"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [activityStatus, setActivityStatus] = useState('Active');
  const [wakefulnessStatus, setWakefulnessStatus] = useState('Awake');
  const [inactivityStatus, setInactivityStatus] = useState('Inactive');
  const [focusLevel, setFocusLevel] = useState(85); // Assume focus level as a percentage
  const [tasksCompleted, setTasksCompleted] = useState(15);
  const [hoursWorked, setHoursWorked] = useState(8);

  // Donut chart data
  const donutData = {
    labels: ['Productive Tasks', 'Idle Time'],
    datasets: [{
      data: [75, 25], // Assume 75% productive tasks and 25% idle time
      backgroundColor: ['#4CAF50', '#FFC107'],
      hoverBackgroundColor: ['#45a049', '#ffca2c'],
    }],
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar /> {/* Navbar stays fixed at the top */}

      {/* Adds spacing below the navbar */}
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* Row 1 - 1 Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Activity & Productivity Card */}
            <div className="flex-1 bg-white shadow-lg rounded-lg p-4 text-gray-700">
              <h2 className="text-xl font-bold mb-4">Employee Activity & Productivity</h2>
              <p>
                <strong>Activity:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs 
                  ${activityStatus === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {activityStatus}
                </span>
              </p>
              <p>
                <strong>Productivity:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs 
                  ${focusLevel >= 70 ? 'bg-green-500' : focusLevel >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                  {focusLevel}%
                </span>
              </p>
              <p>
                <strong>Wakefulness:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs 
                  ${wakefulnessStatus === 'Awake' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  {wakefulnessStatus}
                </span>
              </p>
            </div>

            {/* Quick Access Card */}
            <div className="card bg-white-900 shadow-md text-black p-10">
              <h2 className="text-lg font-semibold">Quick Access</h2>
              <ul className="space-y-2">
                <li>
                  <a href="/dtr" className="text-blue-500 hover:underline">Daily Time Record</a>
                </li>
                <li>
                  <a href="/leaves" className="text-blue-500 hover:underline">Leaves</a>
                </li>
                <li>
                  <a href="/overtime" className="text-blue-500 hover:underline">Overtime</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2 - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inactivity Status Card */}
            <div className="card bg-white-900 shadow-md text-black p-10">
              <h2 className="text-xl font-bold mb-4">Inactivity Status</h2>
              <p>
                <strong>Status:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs 
                  ${inactivityStatus === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {inactivityStatus}
                </span>
              </p>
              <p>
                <strong>Wakefulness:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs 
                  ${wakefulnessStatus === 'Awake' ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  {wakefulnessStatus}
                </span>
              </p>
            </div>

            {/* Key Metrics Card */}
            <div className="card bg-white-900 shadow-md text-black p-10">
              <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
              <p><strong>Hours Worked:</strong> {hoursWorked} hours</p>
              <p><strong>Tasks Completed:</strong> {tasksCompleted}</p>
              <p>
                <strong>Focus Level:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs 
                  ${focusLevel >= 70 ? 'bg-green-500' : focusLevel >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                  {focusLevel}%
                </span>
              </p>
            </div>

            {/* Productivity vs Idle Time Card */}
            <div className="card bg-white-900 shadow-md text-black p-10">
              <h2 className="text-xl font-bold mb-4">Productivity vs Idle Time</h2>
              <div className="w-32 h-32">
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
