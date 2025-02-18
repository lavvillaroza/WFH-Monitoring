"use client";

import Navbar from "@/app/navbar/page";

const ActivityMonitoring = () => {
    return (
      <div className="min-h-screen bg-white">
        <Navbar /> {/* Navbar stays fixed at the top */}
  
        <div className="container mx-auto p-2 mt-2">
          <div className="space-y-6">
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Left Card */}
              <div className="bg-gray-700 shadow-lg text-white p-6 rounded-lg">
                <h2 className="text-xl font-semibold">HUMAN ACTIVITY RECOGNITION</h2>
                <p className="mt-2 text-sm text-gray-300">Alertness Report & Real-Time Alert Log.</p>
                <ul className="mt-3 text-sm text-gray-400 list-disc list-inside">
                  <li>Blink rate and duration (slow blinks may indicate drowsiness).</li>
                  <li>Yawning frequency as a sign of fatigue.</li>
                  <li>Nodding or drooping head movements.</li>
                  <li>Low-alertness duration and frequency.</li>
                  <li>Timestamped records of each alert.</li>
                  <li>Corresponding activity at the time of the alert.</li>
                </ul>
              </div>
  
              {/* Right Card */}
              <div className="bg-gray-700 shadow-lg text-white p-6 rounded-lg">
                <h2 className="text-xl font-semibold">WAKEFULNESS DETECTION</h2>
                <p className="mt-2 text-sm text-gray-300">
                  Recording of user interactions, including screen activity, keystrokes, and mouse movements.
                </p>
                <div className="mt-4 flex justify-center">
                  {/* Placeholder for an image (monitor with peripherals) */}
                  <div className="w-24 h-24 bg-blue-500 rounded-md"></div>
                </div>
              </div>
            </div>


            {/* Row 1 - Full Width Card */}
            <div className="grid grid-cols-1">
              <div className="bg-gray-700 shadow-lg text-white p-6 rounded-lg">
                <h2 className="text-xl font-semibold">SCREENCAST, KEYSTROKES AND MOUSE-CLICKS</h2>
                <p className="mt-2 text-sm text-gray-300">
                  Activity Summary Report, Productivity Report, Inactivity/Idle Time Report, and Custom Activity Detection Report.
                </p>
                <ul className="mt-3 text-sm text-gray-400 list-disc list-inside">
                  <li>Types of activities performed (e.g., sitting, standing, typing).</li>
                  <li>Trends or patterns over time.</li>
                  <li>Percentage of time spent on work-related activities.</li>
                  <li>Time spent on breaks or non-work-related activities.</li>
                  <li>Total idle time during working hours.</li>
                  <li>Custom-defined tasks and their duration.</li>
                  <li>Deviations from expected behaviors.</li>
                </ul>
              </div>
            </div>
  
            
          </div>
        </div>
      </div>
    );
  };
  

export default ActivityMonitoring;
