"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import NavbarEmployer from "@/app/navbarEmployer/page";
import { employees, Employee } from "../dummyData";
import CustomPieChart from "../PieChartComponent";
import { Doughnut } from "react-chartjs-2";
import Image from "next/image";

import { useRouter } from "next/navigation";
ChartJS.register(ArcElement, Tooltip, Legend);


const EmployeeMonitoring = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [sortStatus, setSortStatus] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const router = useRouter();
  const [dateRange, setDateRange] = useState("Daily");
  const [idle, SetIdle] = useState(0);
  const [sleep, SetSleep] = useState(0);
  const [totaltime, SetTotalTime] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [activityStatus, setActivityStatus] = useState("ACTIVE");
  const [wakefulnessStatus, setWakefulnessStatus] = useState("Idle");
  const [productivityPercentage, setProductivityPercentage] = useState(0); 
  const [activityLogs, setActivityLogs] = useState<{ activity: string; start: string; end: string,empId:string }[]>([]);
  const [hoursRendered, SethoursRendered] = useState("");
  const [yawningFrequency, setYawningFrequency] = useState({});
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      // Fetch employee data
      const employeeResponse = await fetch("/employerAPI/employee");
      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employees");
      }
      const employeesData = await employeeResponse.json();
  

      const userResponse = await fetch("/employerAPI/user");
      if (!userResponse.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await userResponse.json();
  
      const employeesWithStatus = employeesData
            .map((employee) => {
              const user = usersData.find((user) => user.email === employee.email);

              if (user && user.status !== "RESIGN") {
                return {
                  ...employee,
                  status: user.status,
                  password: user.password, 
                  role: user.role,
                };
              }

              return null; // Mark employees to be excluded
            })
            .filter(Boolean); // Remove `null` values (employees with "RESIGN" status)


      
      setEmployees(employeesWithStatus);
    } catch (error) {
      console.error("Error fetching employees or users:", error);
    }
  };
console.log(employees, "employees here")

const fetchYawningCount = async () => {
  try {
    const yawningResponse = await fetch("/employerAPI/checkYawning");
    const yawningData = await yawningResponse.json();

    console.log(yawningData, "yawning here");

    if (!yawningData.employees || yawningData.employees.length === 0) {
      console.warn("No yawning data available.");
      setYawningFrequency({});
      return;
    }

    const yawningCount = yawningData.employees.reduce((acc, log) => {
      const { employeeId } = log;

      if (!acc[employeeId]) {
        acc[employeeId] = 0; 
      }

      acc[employeeId]++; 

      return acc;
    }, {});

    console.log("Yawning Count per Employee:", yawningCount);

    // Store the counts in state
    setYawningFrequency(yawningCount);
  } catch (error) {
    console.error("Error fetching yawning data:", error);
    setYawningFrequency({});
  }
};

  

useEffect(() => {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    router.push("/"); 
    return;
  }

  fetchEmployees();
  fetchYawningCount();

  const intervalId = setInterval(() => {
    fetchEmployees();
    fetchYawningCount();
  }, 5000); 

  return () => clearInterval(intervalId);
}, []);

  useEffect(() => {
    if (!selectedEmployee) return;
  
    const fetchData = async () => {
      try {
        const response = await fetch(`/employeeAPI/dashboard?employeeId=${selectedEmployee.employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const data = await response.json();
  
        if (!data || Object.keys(data).length === 0) {
          console.warn("No data received from API.");
          SetIdle(0);
          SetSleep(0);
          SetTotalTime(0);
          setActivityStatus("INACTIVE");
          setWakefulnessStatus("Idle");
          setProductivityPercentage(0);
          SethoursRendered("");
        } else {
          SetIdle(data.idleTime || 0);
          SetSleep(data.sleepingTime || 0);
          SetTotalTime(data.totalTime || 0);
          setActivityStatus(data.employeeStatus || "INACTIVE");
          setWakefulnessStatus(data.wakefulnessStatus || "Idle");
          setProductivityPercentage(data.productivityPercentage || 100);
          
          const totalSeconds = data.totalTime || 0;
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          const formattedTime = `${hours} hrs ${minutes} mins ${seconds} secs`;
          
          SethoursRendered(formattedTime);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setActivityStatus("INACTIVE");
        setWakefulnessStatus("Idle");
        setProductivityPercentage(0);
        SetIdle(0);
        SetSleep(0);
        SetTotalTime(0);
      }
    };
  
    // Fetch data immediately, then every 3 seconds
    fetchData();
    const interval = setInterval(fetchData, 3000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [selectedEmployee]);

  


  
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);

    if (e.target.value === "Date Range") {
      setStartDate("2025-01-01");
      setEndDate("2025-01-31");
      setIsModalOpen(true);
    }
  };


  const donutData = () => {
    if (totaltime === 0) {
      return {
        labels: ["No Data"],
        datasets: [{
          data: [1, 1, 1],
          backgroundColor: ["#e0e0e0"],
        }]
      };
    }
    const idleTimePercentage = (idle / totaltime) * 100;
    const sleepingTimePercentage = (sleep / totaltime) * 100;
    const productiveTimePercentage = 100 - idleTimePercentage - sleepingTimePercentage;

    return {
      labels: ["Productive Tasks", "Idle Time", "Sleeping"],
      datasets: [
        {
          data: [productiveTimePercentage, idleTimePercentage, sleepingTimePercentage],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
          hoverBackgroundColor: ["#45a049", "#ffca2c", "#e53935"],
        },
      ],
    };
  };

  const calculateAverageProductivity = () => {
    const totalEmployees = employees.length;
    const totalProductive = employees.reduce((sum, emp) => sum + (emp.productivity?.productive || 0), 0);
    const totalIdle = employees.reduce((sum, emp) => sum + (emp.productivity?.idle || 0), 0);
    
    return {
      productive: totalEmployees ? totalProductive / totalEmployees : 0,
      idle: totalEmployees ? totalIdle / totalEmployees : 0,
    };
  };

  // const getDonutData = (employee: Employee | null) => {
  //   if (!employee) {
  //     const avg = calculateAverageProductivity();
  //     return {
  //       labels: ["Productive Tasks", "Idle Time"],
  //       datasets: [{
  //         data: [avg.productive, avg.idle],
  //         backgroundColor: ["#4CAF50", "#FFC107"],
  //         hoverBackgroundColor: ["#45a049", "#ffca2c"],
  //       }],
  //     };
  //   }
  //   return {
  //     labels: ["Productive Tasks", "Idle Time"],
  //     datasets: [{
  //       data: [employee.productivity?.productive || 0, employee.productivity?.idle || 0],
  //       backgroundColor: ["#4CAF50", "#FFC107"],
  //       hoverBackgroundColor: ["#45a049", "#ffca2c"],
  //     }],
  //   };
  // };

  

  useEffect(() => {
    if (!selectedEmployee) return;
    setIsFullScreenLoading(true)

  
    const fetchData = async () => {
      try {
        const response = await fetch(`/employeeAPI/humanActivityLog?employeeId=${selectedEmployee.employeeId}`);
        if (!response.ok) throw new Error("Failed to fetch data");
  
        const data = await response.json();
        console.log("Fetched activity log:", data);
        setActivityLogs(data);
      } catch (error) {
        console.error("Error fetching activity log:", error);
      }finally{
        setIsFullScreenLoading(false)

      }
    };
  
    fetchData();
  
    const intervalId = setInterval(fetchData, 3000);
  
    return () => clearInterval(intervalId);
  }, [selectedEmployee]);
  
  const formatDateToPHT = (dateString) => {
    const options = { timeZone: "Asia/Manila", hour12: false };
    return new Date(new Date(dateString).toLocaleString("en-US", options)).toLocaleString("en-US", options);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Idle":
        return "text-[#FFC107]";
      case "Active":
        return "text-green-500";
      case "On Leave":
        return "text-red-500";
      case "Sleeping":
        return "text-blue-500";
      case "Inactive":
        return "text-gray-500";  
      default:
        return "text-gray-500";
    }
  };

    // Filter Employees by Status and Search Query
    const filteredEmployees1 = employees.filter(emp => 
      (sortStatus === "All" || emp.status === sortStatus) &&
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Filter Employees by Status
  
  const filteredEmployees = sortStatus === "All"
    ? employees
    : employees.filter(emp => emp.status === sortStatus);

  // Filter Activity Log based on status and date range
  const filteredActivityLog = selectedEmployee?.activityLog?.filter((log) => {
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
  
    const logDate = new Date(log.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
  
    const matchesDate =
      (!fromDate || logDate >= fromDate) &&
      (!toDate || logDate <= toDate);
  
    return matchesStatus && matchesDate;
  }) || [];

  return (
    <div className="min-h-screen bg-white">
      <NavbarEmployer />
      <div className="container mx-auto p-4 mt-4">
        <div className="space-y-6">
          <div className="flex gap-4">
            {/* Employee List + Filter */}
            <div className="w-[30%] bg-white shadow-lg p-6 rounded-lg h-auto">
              <h2 className="text-xl font-semibold text-gray-700">Employee List</h2>

                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-3 w-full p-2 border bg-white rounded-md text-gray-700"
                />

              {/* Dropdown Filter */}
              <select
                className="mt-3 w-full p-2 border bg-white rounded-md text-gray-700"
                value={sortStatus}
                onChange={(e) => setSortStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Idle</option>
                <option value="On Meeting">On Meeting</option>
              </select>

              {/* Employee List */}
              <div className="mt-4 space-y-3 overflow-y-auto max-h-[650px]">
              {filteredEmployees1.slice(0, 9).map((employee) => (
                <div
                  key={employee.id}
                  className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition-all duration-200 flex items-center"
                  onClick={() => {
                    setSelectedEmployee(employee);
                  }}
                >
                <Image
                  src="/img/user-icon.png"
                  alt="User Icon"
                  width={60} 
                  height={60} 
                  className="w-14 h-14 mr-4"
                />
                 <div className="flex-1 flex justify-between items-center">
                   <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
                   <p className={`text-sm font-medium ${getStatusColor(employee.status === "ACTIVE" ?  employee.activityStatus : employee.status)}`}>
                     {(employee.status === "ACTIVE" ?  employee.activityStatus : employee.status).toUpperCase()}
                   </p>
                 </div>
               </div>
                ))}
              </div>
            </div>

            {/* Right Section: Pie Chart + Activity Logs */}
            <div className="w-[70%] flex flex-col gap-4">
              {/* Dynamic Pie Chart */}
               {/* Productivity vs Idle Time Card */}
            <div className="card bg-white shadow-md text-black p-10">
              <h2 className="text-xl font-bold mb-4">Productivity vs Idle Time vs Sleeping Time</h2>
              <h3 className="text-xl font-bold mb-4">{selectedEmployee?.name}</h3>

              {/* Date Range Selector inside the card */}
              {/* <div className="mb-4">
                <label htmlFor="dateRange" className="text-sm font-medium bg-white">Filter by: </label>
                <select
                  id="dateRange"
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  className="mt-2 border p-2 rounded bg-white"
                >
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Date Range">Date Range</option>
                </select>
              </div> */}

              <div className="flex justify-center items-center w-full h-full">
                <div className="w-80 h-80">
                  <Doughnut data={donutData()} />
                </div>
              </div>
            </div>

           {/* Activity Logs & Wakefulness Detection in a row */}
           <div className="flex flex-col md:flex-row gap-4">
             {/* Human Activity Log */}
              <div className="w-full md:w-1/2 bg-white shadow-lg p-6 rounded-lg min-h-[300px]">
                <h2 className="text-xl font-semibold pb-3 text-gray-700">HUMAN ACTIVITY RECOGNITION</h2>
                <p className="mt-2 text-sm text-gray-500">Alertness Report & Real-Time Alert Log.</p>
                <div className="mt-4 p-3 bg-gray-100 rounded-lg h-80 overflow-auto text-sm">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Real-Time Log:</h3>
                  <ul className="space-y-2">
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log, index) => (
                        <li key={index}>
                          <span className="font-medium text-gray-500">{log.activity}</span>
                          <span className="text-gray-500 text-xs ml-2">
                           {formatDateToPHT(log.start)} -{" "}
                          {log.end ? formatDateToPHT(log.end) : "Ongoing"}
                        </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-500">No logs available.</p>
                    )}
                  </ul>
                </div>
              </div>

                 {/* Wakefulness Detection */}
                <div className="w-full md:w-1/2 bg-white shadow-lg p-6 rounded-lg min-h-[300px]">
                  <h2 className="text-xl font-semibold pb-3 text-gray-700">Wakefulness Detection</h2>

                  {selectedEmployee ? (
                    <div className="space-y-2 text-gray-600 text-sm">
                      {/* <p><strong>Blink Rate:</strong> {}</p> */}
                      {/* <p><strong>Hours Rendered:</strong> {hoursRendered}</p> */}
                      <p><strong>Yawning Frequency:</strong> {yawningFrequency[selectedEmployee.employeeId] || 0}</p>
                      {/* <p><strong>Nodding Motions:</strong> {}</p>
                      <p><strong>Drowsiness Detection:</strong> {}</p> */}
                    </div>
                  ) : (
                    <p className="text-gray-400">Click an employee to view alertness details.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>  
      {isFullScreenLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <span className="loading loading-infinity w-32 h-32 text-info"></span>
            </div>
          )}
     </div>


      // {isModalOpen && selectedEmployee && (
      //   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      //     <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
      //       <h2 className="text-xl font-semibold pb-3 text-gray-700">Full Activity Log</h2>

      //       {/* Status Filter */}
      //       <select
      //         className="w-full p-2 border rounded-md bg-white text-gray-700 mb-3"
      //         value={filterStatus}
      //         onChange={(e) => setFilterStatus(e.target.value)}
      //       >
      //         <option value="All">All</option>
      //         <option value="Active">Active</option>
      //         <option value="Idle">Idle</option>
      //         <option value="On Meeting">On Meeting</option>
      //       </select>

      //       {/* Date Range Filter */}
      //         {/* Start Date */}
      //         <div>
      //             <label className="block text-sm font-medium text-gray-700">Start Date</label>
      //             <input
      //               type="datetime-local"
      //               value={startDate}
      //               onChange={(e) => setStartDate(e.target.value)}
      //               required
      //               className="mt-1 block w-full p-2 border bg-white text-black appearance-auto [&::-webkit-calendar-picker-indicator]:invert"
      //             />
      //           </div>

      //           {/* End Date */}
      //           <div>
      //             <label className="block text-sm font-medium text-gray-700">End Date</label>
      //             <input
      //               type="datetime-local"
      //               value={endDate}
      //               onChange={(e) => setEndDate(e.target.value)}
      //               required
      //               className="mt-1 block w-full p-2 border bg-white text-black appearance-auto [&::-webkit-calendar-picker-indicator]:invert"
      //             />
      //           </div>

      //       <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600" onClick={() => setIsModalOpen(false)}>
      //         Close
      //       </button>
      //     </div>
      //   </div>
      // )}
    // </div>
  );
};

export default EmployeeMonitoring;
