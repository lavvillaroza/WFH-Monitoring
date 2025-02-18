"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";

const Approvals = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // Track the current page

  // Total number of pages (for simplicity, assume 3 pages for each table)
  const totalPages = 3;

  // Toggle menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar /> {/* Navbar stays fixed at the top */}

      {/* Adds spacing below the navbar */}
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* Row 1 - Card with Table and Action Button */}
          <div className="grid grid-cols-1">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">
              <h2 className="text-xl font-semibold mb-4">TIME APPROVAL REQUEST</h2>
              
              {/* Table */}
              <table className="min-w-full table-auto bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-black text-center">Full Name</th>
                    <th className="px-4 py-2 border-b text-black text-center">Type of Request</th>
                    <th className="px-4 py-2 border-b text-black text-center">Date Requested</th>
                    <th className="px-4 py-2 border-b text-black text-center">Status</th>
                    <th className="px-4 py-2 border-b text-black text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Justin John Cristobal</td>
                    <td className="px-4 py-2 border-b text-black text-center">Time in</td>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-15</td>
                    <td className="px-4 py-2 border-b text-black text-center">Pending</td>
                    <td className="px-4 py-2 border-b text-black text-center">
                      {/* Action Button with Menu */}
                      <div className="relative inline-block">
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={toggleMenu}
                        >
                          <span className="text-xl">⋮</span>
                        </button>
                        {isMenuOpen && (
                          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border">
                            <ul className="py-2">
                              <li>
                                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Approve</button>
                              </li>
                              <li>
                                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Decline</button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Jaykko Takahashi</td>
                    <td className="px-4 py-2 border-b text-black text-center">Time in</td>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-16</td>
                    <td className="px-4 py-2 border-b text-black text-center">Pending</td>
                    <td className="px-4 py-2 border-b text-black text-center">
                      {/* Action Button with Menu */}
                      <div className="relative inline-block">
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={toggleMenu}
                        >
                          <span className="text-xl">⋮</span>
                        </button>
                        {isMenuOpen && (
                          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border">
                            <ul className="py-2">
                              {/* button */}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
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

          {/* Row 2 - Full Width Card */}
          <div className="grid grid-cols-1">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">
              <h2 className="text-xl font-semibold mb-4">APPROVED TIME REQUEST</h2>
              
              {/* Table */}
              <table className="min-w-full table-auto bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-black text-center">Full Name</th>
                    <th className="px-4 py-2 border-b text-black text-center">Type of Request</th>
                    <th className="px-4 py-2 border-b text-black text-center">Date Requested</th>
                    <th className="px-4 py-2 border-b text-black text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Jaykko Takahashi</td>
                    <td className="px-4 py-2 border-b text-black text-center">Time Out</td>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-12</td>
                    <td className="px-4 py-2 border-b text-black text-center">Approved</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Lance Arjay Villaroza</td>
                    <td className="px-4 py-2 border-b text-black text-center">Time In</td>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-12</td>
                    <td className="px-4 py-2 border-b text-black text-center">Approved</td>
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

export default Approvals;
