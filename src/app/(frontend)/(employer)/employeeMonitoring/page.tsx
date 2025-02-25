"use client";

import { useState } from "react";
import NavbarEmployer from "@/app/navbarEmployer/page";
import { employees, Employee } from "../dummyData";
import CustomPieChart from "../PieChartComponent";

const EmployeeMonitoring = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [sortStatus, setSortStatus] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal Filters
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Idle":
        return "text-[#FFC107]";
      case "Active":
        return "text-green-500";
      case "On Meeting":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  // Filter Employees by Status
  const filteredEmployees = sortStatus === "All"
    ? employees
    : employees.filter(emp => emp.status === sortStatus);

  // Filter Activity Log based on status and date range
  const filteredActivityLog = selectedEmployee?.activityLog.filter((log) => {
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

              {/* Dropdown Filter */}
              <select
                className="mt-3 w-full p-2 border bg-white rounded-md text-gray-700"
                value={sortStatus}
                onChange={(e) => setSortStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="On Meeting">On Meeting</option>
              </select>

              {/* Employee List */}
              <div className="mt-4 space-y-3">
                {filteredEmployees.map((employee) => (
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
                <CustomPieChart employee={selectedEmployee} />
              </div>

              {/* Activity Logs - Two Sections */}
              <div className="flex gap-4">
                {/* Activity Log */}
                <div className="w-1/2 bg-white shadow-lg p-6 rounded-lg min-h-[300px] flex flex-col">
                  <h2 className="text-xl font-semibold pb-3 text-gray-700">Activity Log</h2>

                  {selectedEmployee ? (
                    <ul className="mt-3 text-sm text-gray-500 list-disc list-inside flex-1">
                      {selectedEmployee.activityLog.slice(0, 5).map((log, index) => (
                        <li key={index}>{log.date} - {log.log} ({log.status})</li>
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
                      <p><strong>Blink Rate:</strong> {selectedEmployee.activeness.blinkRate}</p>
                      <p><strong>Active Duration:</strong> {selectedEmployee.activeness.duration}</p>
                      <p><strong>Yawning Frequency:</strong> {selectedEmployee.activeness.yawningFrequency}</p>
                      <p><strong>Nodding Motions:</strong> {selectedEmployee.activeness.nodMotions}</p>
                      <p><strong>Drowsiness Detection:</strong> {selectedEmployee.activeness.drowsinessDetection}</p>
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
              className="w-full p-2 border rounded-md bg-gray-300 text-gray-700 mb-3"
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
                    className="mt-1 block w-full p-2 border rounded-md"
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
                    className="mt-1 block w-full p-2 border rounded-md"
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
