"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import NavbarEmployer from "@/app/navbarEmployer/page";
import { employees, Employee } from "../dummyData";
import CustomPieChart from "../PieChartComponent";
import { Doughnut } from "react-chartjs-2";
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

  // Modal Filters
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const fetchEmployees = async () => {
    try {
      // Fetch employee data
      const employeeResponse = await fetch("/employerAPI/employee");
      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employees");
      }
      const employeesData = await employeeResponse.json();
  
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
            password: user.password, 
            role:user.role,// Ensure password is included
          };
        }
        return employee;
      });
  
      setEmployees(employeesWithStatus);
    } catch (error) {
      console.error("Error fetching employees or users:", error);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      router.push("/"); // Redirect if not logged in
    } else {
      fetchEmployees();
    }
  }, []);

  const calculateAverageProductivity = () => {
    const totalEmployees = employees.length;
    const totalProductive = employees.reduce((sum, emp) => sum + (emp.productivity?.productive || 0), 0);
    const totalIdle = employees.reduce((sum, emp) => sum + (emp.productivity?.idle || 0), 0);
    
    return {
      productive: totalEmployees ? totalProductive / totalEmployees : 0,
      idle: totalEmployees ? totalIdle / totalEmployees : 0,
    };
  };

  const getDonutData = (employee: Employee | null) => {
    if (!employee) {
      const avg = calculateAverageProductivity();
      return {
        labels: ["Productive Tasks", "Idle Time"],
        datasets: [{
          data: [avg.productive, avg.idle],
          backgroundColor: ["#4CAF50", "#FFC107"],
          hoverBackgroundColor: ["#45a049", "#ffca2c"],
        }],
      };
    }
    return {
      labels: ["Productive Tasks", "Idle Time"],
      datasets: [{
        data: [employee.productivity?.productive || 0, employee.productivity?.idle || 0],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#ffca2c"],
      }],
    };
  };

  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "INACTIVE":
        return "text-[#FFC107]";
      case "ACTIVE":
        return "text-green-500";
      case "On Meeting":
        return "text-blue-500";
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
            <div className="w-[30%] bg-white shadow-lg p-6 rounded-lg h-screen">
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
              <div className="mt-4 space-y-3">
                {filteredEmployees1.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition-all duration-200"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
                    <p className={`mt-1 text-sm font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section: Pie Chart + Activity Logs */}
            <div className="w-[70%] flex flex-col gap-4">
              {/* Dynamic Pie Chart */}
              <div className="w-full bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-xl font-semibold pb-3 text-gray-700"> Employee Activity Chart {selectedEmployee ? selectedEmployee.name : ""}</h2>
              </div>

              {/* Activity Logs - Two Sections */}
              <div className="flex gap-4">
                {/* Activity Log */}
                <div className="w-1/2 bg-white shadow-lg p-6 rounded-lg min-h-[300px] flex flex-col">
                  <h2 className="text-xl font-semibold pb-3 text-gray-700">Activity Log</h2>

                  {selectedEmployee ? (
                    <ul className="mt-3 text-sm text-gray-500 list-disc list-inside flex-1">
                      {selectedEmployee?.activityLog?.slice(0, 5).map((log, index) => (
                          <li key={index}>{log.date} - {log.log} ({log.status})</li>
                        )) || <p className="text-gray-400">No activity logs available.</p>}
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 flex-1">Click an employee to view activity.</p>
                  )}

                  {/* More Button Inside Card */}
                  {selectedEmployee && (
                    <button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                      onClick={() => setIsModalOpen(true)}
                    >
                      More in Activity Log
                    </button>
                  )}
                </div>

                {/* Wakefulness Detection */}
                <div className="w-1/2 bg-white shadow-lg p-6 rounded-lg min-h-[300px]">
                  <h2 className="text-xl font-semibold pb-3 text-gray-700">Wakefulness Detection</h2>

                  {selectedEmployee ? (
                    <div className="space-y-2 text-gray-600 text-sm">
                      <p><strong>Blink Rate:</strong> {}</p>
                      <p><strong>Active Duration:</strong> {}</p>
                      <p><strong>Yawning Frequency:</strong> {}</p>
                      <p><strong>Nodding Motions:</strong> {}</p>
                      <p><strong>Drowsiness Detection:</strong> {}</p>
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

      {/* Modal for Full Activity Log */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold pb-3 text-gray-700">Full Activity Log</h2>

            {/* Status Filter */}
            <select
              className="w-full p-2 border rounded-md bg-white text-gray-700 mb-3"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Idle">Idle</option>
              <option value="On Meeting">On Meeting</option>
            </select>

            {/* Date Range Filter */}
              {/* Start Date */}
              <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border bg-white text-black appearance-auto [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border bg-white text-black appearance-auto [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeMonitoring;
