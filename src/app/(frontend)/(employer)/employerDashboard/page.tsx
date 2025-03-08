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
  

  const getDonutData = (employee: Employee | null) => {
    if (!employee) {
      const avg = calculateAverageProductivity();
      return {
        labels: ["Sleeping Time", "Idle Time"],
        datasets: [{
          data: [avg.totalSleep, avg.totalIdle],
          backgroundColor: ["orange", "#FFC107"],
          hoverBackgroundColor: ["#45a049", "#ffca2c"],
        }],
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
  };

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
            <div className="flex items-center w-full">
            <div className="w-full sm:w-[250px] md:w-[280px] lg:w-[300px] max-w-full mx-auto">
                <Doughnut data={getDonutData(selectedEmployee)} options={{ maintainAspectRatio: false }} />
              </div>
              <div className="ml-6 text-sm text-gray-700">
                <p><span className="font-bold text-orange-600">Sleeping Time:</span> {humanActivityLog.sleeping}</p>
                <p><span className="font-bold text-yellow-500">Idle Time:</span> {humanActivityLog.idle}</p>
                <p><span className="font-bold text-red-600">Inactive:</span> 2</p>
                <p><span className="font-bold text-orange-500">Active:</span> 1</p>
              </div>
            </div>
          </div>

         {/* Human Activity Recognition */}
          <div className="mt-4 p-3 bg-gray-100 rounded-lg h-80 overflow-auto text-sm">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Real-Time Log:</h3>
            {activityLogs.length > 0 ? (
            activityLogs.map((log, index) => {
              const employee = employees.find(emp => emp.employeeId === (log.employeeId)); // Ensure type match
            
              const employeeName = employee ? employee.name : "Unknown"; 
            
              return (
                <p key={index} className="text-gray-600">
                  <span className="font-semibold">{new Date(log.start).toLocaleTimeString("en-PH")}: </span>
                  {employeeName} is {log.activity.toLowerCase()}.
                </p>
              );
            })
            
            ) : (
              <p className="text-gray-500">No recent activity logs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
