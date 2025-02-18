"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";

const Reports = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Toggle menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle page changes
  const handlePageChange = (direction) => {
    if (direction === 'next') {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'previous' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter handler for date range
  const handleDateFilter = () => {
    console.log('Filtering reports from', startDate, 'to', endDate);
    // Implement filtering logic here
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar /> {/* Navbar stays fixed at the top */}

      {/* Adds spacing below the navbar */}
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-2">
          {/* EMPLOYEE ATTENDANCE Card */}
          <div className="grid grid-cols-1">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">
              <h2 className="text-xl font-semibold mb-4">EMPLOYEE ATTENDANCE</h2>

              {/* Date Range Filter */}
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm">Filter by Date Range</label>
                <input 
                  type="date" 
                  id="startDate" 
                  className="border rounded p-2 text-black" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                /> &emsp;
                <input 
                  type="date" 
                  id="endDate" 
                  className="border rounded p-2 text-black" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />&emsp;
                <button 
                  onClick={handleDateFilter} 
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                  Filter
                </button>
              </div>

              {/* Table */}
              <table className="min-w-full table-auto bg-white text-black">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-center">Full Name</th>
                    <th className="px-4 py-2 border-b text-center">Hours Rendered</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b text-center">Justin John Cristobal</td>
                    <td className="px-4 py-2 border-b text-center">8 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-center">Jaykko Takahashi</td>
                    <td className="px-4 py-2 border-b text-center">7 hours</td>
                  </tr>
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => handlePageChange('previous')} 
                  className="bg-gray-500 text-white px-4 py-2 rounded" 
                  disabled={currentPage === 1}>
                  Previous
                </button>
                <div className="text-center text-black">Page {currentPage}</div>
                <button 
                  onClick={() => handlePageChange('next')} 
                  className="bg-gray-500 text-white px-4 py-2 rounded">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* INACTIVE ACTIVITIES Card */}
          <div className="grid grid-cols-1">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">
              <h2 className="text-xl font-semibold mb-4">INACTIVE ACTIVITIES</h2>

             {/* Date Range Filter */}
             <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm">Filter by Date Range</label>
                <input 
                  type="date" 
                  id="startDate" 
                  className="border rounded p-2 text-black" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                /> &emsp;
                <input 
                  type="date" 
                  id="endDate" 
                  className="border rounded p-2 text-black" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />&emsp;
                <button 
                  onClick={handleDateFilter} 
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                  Filter
                </button>
              </div>

              {/* Table */}
              <table className="min-w-full table-auto bg-white text-black">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-center">Employee ID</th>
                    <th className="px-4 py-2 border-b text-center">Full Name</th>
                    <th className="px-4 py-2 border-b text-center">Time Inactive</th>
                    <th className="px-4 py-2 border-b text-center">Type of Inactivity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b text-center">EMP001</td>
                    <td className="px-4 py-2 border-b text-center">Lance Arjay Villaroza</td>
                    <td className="px-4 py-2 border-b text-center">3 minutes</td>
                    <td className="px-4 py-2 border-b text-center">Sleeping</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-center">EMP002</td>
                    <td className="px-4 py-2 border-b text-center">Justin John Cristobal</td>
                    <td className="px-4 py-2 border-b text-center">2 hours</td>
                    <td className="px-4 py-2 border-b text-center">Out of Area</td>
                  </tr>
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={() => handlePageChange('previous')} 
                  className="bg-gray-500 text-white px-4 py-2 rounded" 
                  disabled={currentPage === 1}>
                  Previous
                </button>
                <div className="text-center text-black">Page {currentPage}</div>
                <button 
                  onClick={() => handlePageChange('next')} 
                  className="bg-gray-500 text-white px-4 py-2 rounded">
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

export default Reports;
