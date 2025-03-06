"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import NavbarEmployer from "@/app/navbarEmployer/page";
import { Doughnut } from "react-chartjs-2";
import { useRouter } from "next/navigation";
ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeMonitoring = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortStatus, setSortStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/");
    } else {
      fetchEmployees();
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/employerAPI/employee");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const getDonutData = (employee) => ({
    labels: ["Productive", "Idle"],
    datasets: [
      {
        data: [employee.productivity?.productive || 0, employee.productivity?.idle || 0],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#ffca2c"],
      },
    ],
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "INACTIVE": return "text-yellow-500";
      case "ACTIVE": return "text-green-500";
      case "On Meeting": return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  const filteredEmployees = employees.filter(emp =>
    (sortStatus === "All" || emp.status === sortStatus) &&
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <NavbarEmployer />
      <div className="container mx-auto p-4 mt-4">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md"
          />
          <select
            className="p-2 border rounded-md"
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Idle</option>
            <option value="On Meeting">On Meeting</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white shadow-lg p-4 rounded-lg cursor-pointer hover:shadow-xl" onClick={() => { setSelectedEmployee(employee); setIsModalOpen(true); }}>
              <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
              <p className={`text-sm font-medium ${getStatusColor(employee.status)}`}>{employee.status}</p>
              <div className="w-32 h-32 mx-auto mt-4">
                <Doughnut data={getDonutData(employee)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold">{selectedEmployee.name} - Activity Log</h2>
            <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
              {selectedEmployee.activityLog?.slice(0, 5).map((log, index) => (
                <li key={index}>{log.date} - {log.log} ({log.status})</li>
              )) || <p>No activity logs available.</p>}
            </ul>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeMonitoring;
