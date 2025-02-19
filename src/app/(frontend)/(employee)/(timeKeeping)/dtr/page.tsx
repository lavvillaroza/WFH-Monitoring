"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";
import { FileText } from "lucide-react"; // Importing the icon for export to PDF

const DailyTimeRecord = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [startDate, setStartDate] = useState(""); // Start date for filter
  const [endDate, setEndDate] = useState(""); // End date for filter
  const totalPages = 3; // Total number of pages (for simplicity)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle date range filter change
  const handleDateRangeChange = () => {
    // You can implement custom logic to filter the data based on date range
    console.log(`Filtering from ${startDate} to ${endDate}`);
  };

  // Export to PDF (you can add actual export functionality here)
  const handleExportToPDF = () => {
    console.log("Exporting to PDF...");
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar /> {/* Navbar stays fixed at the top */}

      {/* Adds spacing below the navbar */}
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* Row 1 - Filter and Export Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
            <h1>Filter By:</h1>
              {/* Date Range Filter */}
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

            {/* Export Button */}
            <button
              onClick={handleExportToPDF}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md"
            >
              <FileText className="w-5 h-5 mr-2" /> Export to PDF
            </button>
          </div>

          {/* Row 2 - Table */}
          <div className="grid grid-cols-1">
            <div className="card bg-white-900 shadow-xl text-black p-10">
              <h2 className="text-xl font-semibold mb-4">DAILY TIME RECORD</h2>

              {/* Table */}
              <table className="min-w-full table-auto bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-black text-center">Date</th>
                    <th className="px-4 py-2 border-b text-black text-center">Day</th>
                    <th className="px-4 py-2 border-b text-black text-center">Check In</th>
                    <th className="px-4 py-2 border-b text-black text-center">Break Out</th>
                    <th className="px-4 py-2 border-b text-black text-center">Break In</th>
                    <th className="px-4 py-2 border-b text-black text-center">Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-15</td>
                    <td className="px-4 py-2 border-b text-black text-center">Monday</td>
                    <td className="px-4 py-2 border-b text-black text-center">08:00 AM</td>
                    <td className="px-4 py-2 border-b text-black text-center">12:00 PM</td>
                    <td className="px-4 py-2 border-b text-black text-center">01:00 PM</td>
                    <td className="px-4 py-2 border-b text-black text-center">05:00 PM</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-16</td>
                    <td className="px-4 py-2 border-b text-black text-center">Tuesday</td>
                    <td className="px-4 py-2 border-b text-black text-center">08:15 AM</td>
                    <td className="px-4 py-2 border-b text-black text-center">12:15 PM</td>
                    <td className="px-4 py-2 border-b text-black text-center">01:10 PM</td>
                    <td className="px-4 py-2 border-b text-black text-center">05:10 PM</td>
                  </tr>
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="text-center text-black">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTimeRecord;
