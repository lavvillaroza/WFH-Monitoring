"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react"; // Importing icons for Edit and Delete actions

const Leaves = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const totalPages = 3; // Total number of pages (for simplicity)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Toggle menu visibility for actions (Edit/Delete)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar /> {/* Navbar stays fixed at the top */}

      {/* Adds spacing below the navbar */}
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* New Row - Leave Summary Table (Available, Pending, Approved, Rejected) */}
          <div className="w-full">
            <div className="card bg-white-900 shadow-xl text-black p-6">
              <h2 className="text-xl font-semibold mb-4">LEAVE SUMMARY</h2>

              {/* Table for leave summary */}
              <table className="min-w-full table-auto bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-black text-center">Leave Type</th>
                    <th className="px-4 py-2 border-b text-black text-center">Available Leaves</th>
                    <th className="px-4 py-2 border-b text-black text-center">Pending Leaves</th>
                    <th className="px-4 py-2 border-b text-black text-center">Approved Leaves</th>
                    <th className="px-4 py-2 border-b text-black text-center">Rejected Leaves</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Sick Leave</td>
                    <td className="px-4 py-2 border-b text-black text-center">5 </td>
                    <td className="px-4 py-2 border-b text-black text-center">1</td>
                    <td className="px-4 py-2 border-b text-black text-center">5 </td>
                    <td className="px-4 py-2 border-b text-black text-center">0 </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Vacation Leave</td>
                    <td className="px-4 py-2 border-b text-black text-center">8 </td>
                    <td className="px-4 py-2 border-b text-black text-center">0 </td>
                    <td className="px-4 py-2 border-b text-black text-center">6 </td>
                    <td className="px-4 py-2 border-b text-black text-center">0 </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Emergency Leave</td>
                    <td className="px-4 py-2 border-b text-black text-center">3 </td>
                    <td className="px-4 py-2 border-b text-black text-center">0</td>
                    <td className="px-4 py-2 border-b text-black text-center">2 </td>
                    <td className="px-4 py-2 border-b text-black text-center">0 </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 2 - List of Leave Applications (Full Width) */}
          <div className="w-full">
            <div className="card bg-white-900 shadow-xl text-black p-6">
              <h2 className="text-xl font-semibold mb-4">LEAVE APPLICATIONS</h2>

              {/* Table */}
              <table className="min-w-full table-auto bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-black text-center">Leave Type</th>
                    <th className="px-4 py-2 border-b text-black text-center">Start Date</th>
                    <th className="px-4 py-2 border-b text-black text-center">End Date</th>
                    <th className="px-4 py-2 border-b text-black text-center">Status</th>
                    <th className="px-4 py-2 border-b text-black text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Sick Leave</td>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-15</td>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-16</td>
                    <td className="px-4 py-2 border-b text-black text-center">Approved</td>
                    <td className="px-4 py-2 border-b text-black text-center">
                      {/* Only show actions if the status is not "Approved" */}
                      {false && (
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
                                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Vacation Leave</td>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-16</td>
                    <td className="px-4 py-2 border-b text-black text-center">2025-02-18</td>
                    <td className="px-4 py-2 border-b text-black text-center">Pending</td>
                    <td className="px-4 py-2 border-b text-black text-center">
                      {/* Only show actions if the status is not "Approved" */}
                      {true && (
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
                                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
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
        </div>
      </div>
    </div>
  );
};

export default Leaves;
