"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";
import { FileText, MoreVertical, Plus } from "lucide-react";
import OvertimeModal from "../modals/overtime-form/page";

const Overtime = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalPages = 3;

  const records = [
    { dateFrom: "2025-02-15 08:00 AM ", dateTo: "2025-02-15 10:00 AM", overtime: "2 hours", status: "Pending" },
    { dateFrom: "2025-02-16 05:00 PM  ", dateTo: "2025-02-16 07:00 PM", overtime: "2 hours", status: "Approved" },
  ];

  const handlePageChange = (pageNumber:any) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDateRangeChange = () => {
    console.log(`Filtering from ${startDate} to ${endDate}`);
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar />

      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* Row 1 - Filter, Export, and Add Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <h1>Filter By:</h1>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border rounded-md"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border rounded-md"
              />
              <button
                onClick={handleDateRangeChange}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Filter
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                <Plus className="w-5 h-5 mr-2" /> Add
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="grid grid-cols-1">
            <div className="card bg-white shadow-xl text-black p-10">
              <h2 className="text-xl font-semibold mb-4">OVERTIME</h2>
              <table className="min-w-full table-auto bg-white border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border text-black text-center">Date From</th>
                    <th className="px-4 py-2 border text-black text-center">Date To</th>
                    <th className="px-4 py-2 border text-black text-center">Total Overtime</th>
                    <th className="px-4 py-2 border text-black text-center">Status</th>
                    <th className="px-4 py-2 border text-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-black text-center">{record.dateFrom}</td>
                      <td className="px-4 py-2 text-black text-center">{record.dateTo}</td>
                      <td className="px-4 py-2 text-black text-center">{record.overtime}</td>
                      <td
                        className={`px-4 py-2 text-center ${
                          record.status === "Pending" ? "text-yellow-600" : "text-green-600"
                        }`}
                      >
                        {record.status}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {record.status === "Pending" && (
                          <div className="relative group inline-block">
                            <button className="p-2 rounded-md hover:bg-gray-200">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Edit</button>
                              <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">Delete</button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <OvertimeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Overtime;
