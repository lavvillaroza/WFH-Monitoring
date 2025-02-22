"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";
import { FileText, MoreVertical, Plus } from "lucide-react";
import DTRPModal from "../modals/dtrp-form/page";

const DailyTimeRecord = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalPages = 3;

  const records = [
    { date: "2025-02-15", time: "08:00 AM", type: "Time in", remarks: "Forgot to time in", status: "Pending" },
    { date: "2025-02-16", time: "05:10 PM", type: "Time out", remarks: "Forgot to time out", status: "Approved" },
  ];

  const handlePageChange = (pageNumber:any) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDateRangeChange = () => {
    console.log(`Filtering from ${startDate} to ${endDate}`);
  };

  const handleExportToPDF = () => {
    console.log("Exporting to PDF...");
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
              <h2 className="text-xl font-semibold mb-4">DAILY TIME RECORD PROBLEM</h2>
              <table className="min-w-full table-auto bg-white border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border text-black text-center">Date</th>
                    <th className="px-4 py-2 border text-black text-center">Time</th>
                    <th className="px-4 py-2 border text-black text-center">Type</th>
                    <th className="px-4 py-2 border text-black text-center">Remarks</th>
                    <th className="px-4 py-2 border text-black text-center">Status</th>
                    <th className="px-4 py-2 border text-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 text-black text-center">{record.date}</td>
                      <td className="px-4 py-2 text-black text-center">{record.time}</td>
                      <td className="px-4 py-2 text-black text-center">{record.type}</td>
                      <td className="px-4 py-2 text-black text-center">{record.remarks}</td>
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
      <DTRPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DailyTimeRecord;
