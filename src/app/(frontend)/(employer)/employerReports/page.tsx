"use client";

import NavbarEmployer from "@/app/navbarEmployer/page";
import { useState } from "react";
import { employees } from "../dummyData";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedEmployees = employees.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(displayedEmployees.map((emp) => emp.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectEmployee = (id: number) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((empId) => empId !== id) : [...prevSelected, id]
    );
  };

  const handlePageChange = (direction: string) => {
    if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <NavbarEmployer />
      <div className="container mx-auto p-4 mt-4">
        <div className="space-y-4">
          <div className="custom-card-bg shadow-md text-black shadow-xl p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">EMPLOYEE ATTENDANCE</h2>
            <div className="mb-4 flex flex-wrap gap-4 items-end">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border bg-red-700 rounded-md bg-white text-black appearance-auto"
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
                  className="mt-1 block w-full p-2 border rounded-md bg-white text-black"
                />
              </div>

              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Filter</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white text-black rounded-lg shadow-lg">
                <thead>
                  <tr>
                    <th className="p-3 text-center">
                      <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    </th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Job</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedEmployees.map((employee) => (
                    <tr key={employee.id} className="border-t">
                      <td className="p-3 text-center">
                        <input type="checkbox" checked={selectedEmployees.includes(employee.id)} onChange={() => toggleSelectEmployee(employee.id)} />
                      </td>
                      <td className="p-3">{employee.name}</td>
                      <td className="p-3">{employee.job}</td>
                      <td className="p-3">{employee.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600">Generate Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
