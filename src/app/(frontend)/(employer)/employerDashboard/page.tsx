"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import NavbarEmployer from "@/app/navbarEmployer/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";



ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [todayDate, setTodayDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [humanActivityLog, setHumanActivityLog] = useState({ idle: 0, sleeping: 0 });
  const [activityLogs, setActivityLogs] = useState<{ activity: string; start: string; end: string ,employeeId:string }[]>([]);
  const [latestRequests, setLatestRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const date = new Date().toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Manila",
    });
    setTodayDate(date);

    if (!authToken) {
      router.push("/"); // Redirect if not logged in
    } else {
      fetchEmployees();
      fetchNotificationLogs();
    }
  }, []);

  const fetchEmployees = async () => {
    const eventSource = new EventSource("/employerAPI/realTimeLogs");
    try {
      // Fetch employee data
      const employeeResponse = await fetch("/employerAPI/employee");
      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employees");
      }
      const employeesData = await employeeResponse.json();

      const ActivityLogResponse = await fetch("/employerAPI/humanActivityLog");
      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employees");
      }
      const ActivityLogData = await ActivityLogResponse.json();

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

      const totalDurations = ActivityLogData.reduce(
        (acc, log) => {
          if (log.activity === "Idle") {
            acc.idle += log.duration;
          } else if (log.activity === "Sleeping") {
            acc.sleeping += log.duration;
          }
          return acc;
        },
        { idle: 0, sleeping: 0 } // Initial state
      );

      console.log("Total Idle Duration:", totalDurations.idle);
      console.log("Total Sleeping Duration:", totalDurations.sleeping);
      setHumanActivityLog(totalDurations)
  
      // Fetch user data (including passwords)
      const userResponse = await fetch("/employerAPI/user");
      if (!userResponse.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await userResponse.json();
  
      const employeesWithStatus = employeesData.map((employee) => {
        const user = usersData.find((user) => user.email === employee.email);
        if (user) {
          return {
            ...employee,
            status: user.status,
            employeeId: user.employeeId,
            password: user.password, 
            role:user.role,// Ensure password is included
          };
        }
        return employee;
      });
  
      setEmployees(employeesWithStatus);
      console.log(employees)
    } catch (error) {
      console.error("Error fetching employees or users:", error);
    }
    return () => {
      eventSource.close();
    };
  };

  

  const calculateAverageProductivity = () => {
    const totalEmployees = employees.length; // Total number of employees
    const totalSleep = humanActivityLog.sleeping; // Total sleeping time
    const totalIdle = humanActivityLog.idle; // Total idle time
  
    return {
      totalSleep: totalSleep, // Returning total sleep time
      totalIdle: totalIdle,   // Returning total idle time
    };
  };
  
    const fetchNotificationLogs = async () => {
      try {
        const response = await fetch("/employerAPI/notifications");
        const data = await response.json();
    
        // Sort latest and pending requests by createdAt in descending order (newest first)
        const sortedLatestRequests = (data.latest || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    
        const sortedPendingRequests = (data.pending || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    
        setLatestRequests(sortedLatestRequests);
        setPendingRequests(sortedPendingRequests);
      } catch (error) {
        console.error("Error fetching notification logs:", error);
        setLatestRequests([]);
        setPendingRequests([]);
      }
    };
  

  const getDonutData = (employee: Employee | null) => {
    if (!employee) {
      const avg = calculateAverageProductivity();
      return {
        labels: ["No Data"],
        datasets: [{
          data: [100],
          backgroundColor: ["#e0e0e0"],
        }]
      };
    }
    return {
      labels: ["Sleeping Time", "Idle Time"],
      datasets: [{
        data: [employee.productivity?.productive || 0, employee.productivity?.idle || 0],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#ffca2c"],
      }],
    };
  }
  return (
    <div className="min-h-screen bg-white">
      <NavbarEmployer />
      <div className="container mx-auto p-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Employee Activity Chart */}
              <div className="p-6 bg-white shadow-lg rounded-lg">
                <p className="text-md text-gray-500 mb-2">{todayDate}</p>
                <h2 className="text-lg font-semibold pb-3 text-gray-700">Employee Activity Chart</h2>
                <p className="text-md text-gray-600 mb-2">
                  Total Employees: <span className="font-bold">{employees.length}</span>
                </p>
                
                {/* Flex container to center Doughnut and align text to the right */}
                <div className="flex items-center justify-center w-full">
                  {/* Centered Doughnut Chart */}
                  <div className="w-[250px] sm:w-[280px] md:w-[300px] lg:w-[350px]">
                    <Doughnut data={getDonutData()} options={{ maintainAspectRatio: false }} />
                  </div>

                  {/* Right-side Labels */}
                  <div className="ml-6 text-sm text-gray-700">
                    <p className="font-bold text-orange-600">Sleeping Time: {humanActivityLog.sleeping}</p>
                    <p className="font-bold text-yellow-500 mt-2">Idle Time: {humanActivityLog.idle}</p>
                  </div>
                </div>
              </div>

          
              {/* Human Activity Recognition Card */}
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg h-80 overflow-auto text-sm">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Real-Time Log:</h3>
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log, index) => {
                        const employee = employees.find(emp => emp.employeeId === log.employeeId);
                        const employeeName = employee ? employee.name : "Unknown";

                        return (
                          <p key={index} className="text-gray-600">
                            <span className="font-semibold">
                              {new Date(log.start).toLocaleTimeString("en-PH")}: 
                            </span>
                            {` ${employeeName} is ${log.activity.toLowerCase()}.`}
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No recent activity logs.</p>
                    )}
                  </div>
                </div>


              {/* Notification Logs Card */}
                  <div className="card bg-white shadow-md text-black p-6">
                    <h1 className="text-xl font-bold mb-4">NOTIFICATION LOGS</h1>

                    {/* Latest Requests Section */}
                    <h2 className="font-semibold text-lg">Latest Requests</h2>
                    <hr className="my-2 border-gray-300" />
                    {latestRequests.length > 0 ? (
                      latestRequests.slice(0, 5).map((req, index) => { // Show only 5 items
                        const employee = employees.find(emp => emp.employeeId === req.employeeId);
                        const employeeName = employee ? employee.name : "Unknown";

                        return (
                          <p key={index} className="text-yellow-600 border-b py-2">
                            <span className="cursor-pointer font-bold text-green-600 uppercase text-xs">
                              {employeeName}
                            </span>{" "}
                            filed a{" "}
                            <span
                              className="cursor-pointer hover:text-yellow-400 text-xs"
                              onClick={() => handleNavigation(req.type)}
                            >
                              {req.type}: {req.status} ({new Date(req.createdAt).toLocaleString()})
                            </span>
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No pending requests</p>
                    )}

                    {/* "More" link */}
                    {latestRequests.length > 5 && (
                      <div className="mt-2 text-right">
                        <a href="/notifications" className="text-blue-500 hover:underline text-sm">
                          More →
                        </a>
                      </div>
                    )}

                    {/* Pending Requests Section */}
                    <h3 className="font-semibold text-lg mt-4">Pending Requests</h3>
                    <hr className="my-2 border-gray-300" />
                    {pendingRequests.length > 0 ? (
                      pendingRequests.slice(0, 5).map((req, index) => { // Show only 5 items
                        const employee = employees.find(emp => emp.employeeId === req.employeeId);
                        const employeeName = employee ? employee.name : "Unknown";

                        return (
                          <p key={index} className="text-yellow-600 border-b py-2">
                            <span className="cursor-pointer font-bold text-green-600 uppercase text-xs">
                              {employeeName}
                            </span>{" "}
                            filed a{" "}
                            <span
                              className="cursor-pointer hover:text-yellow-400 text-xs"
                              onClick={() => handleNavigation(req.type)}
                            >
                              {req.type}: {req.status} ({new Date(req.createdAt).toLocaleString()})
                            </span>
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No pending requests</p>
                    )}

                    {/* "More" link for Pending Requests */}
                    {pendingRequests.length > 5 && (
                      <div className="mt-2 text-right">
                        <a href="/notifications" className="text-blue-500 hover:underline text-sm">
                          More →
                        </a>
                      </div>
                    )}
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
      </div>
    </div>
  );
};

export default Dashboard;
