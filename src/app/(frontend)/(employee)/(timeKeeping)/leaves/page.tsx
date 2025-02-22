"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";
import { Edit, Trash2, PlusCircle, PlusIcon } from "lucide-react"; // Importing Plus icon
import LeaveModal from "../modals/leave-form/page";
const Leaves = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = (pageNumber:any) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar />

      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* Leave Summary */}
          <div className="w-full">
            <div className="card bg-white-900 shadow-xl text-black p-6">
              <h2 className="text-xl font-semibold mb-4">LEAVE SUMMARY</h2>
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
                    <td className="px-4 py-2 border-b text-black text-center">5</td>
                    <td className="px-4 py-2 border-b text-black text-center">1</td>
                    <td className="px-4 py-2 border-b text-black text-center">5</td>
                    <td className="px-4 py-2 border-b text-black text-center">0</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Vacation Leave</td>
                    <td className="px-4 py-2 border-b text-black text-center">8</td>
                    <td className="px-4 py-2 border-b text-black text-center">0</td>
                    <td className="px-4 py-2 border-b text-black text-center">6</td>
                    <td className="px-4 py-2 border-b text-black text-center">0</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b text-black text-center">Emergency Leave</td>
                    <td className="px-4 py-2 border-b text-black text-center">3</td>
                    <td className="px-4 py-2 border-b text-black text-center">0</td>
                    <td className="px-4 py-2 border-b text-black text-center">2</td>
                    <td className="px-4 py-2 border-b text-black text-center">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave Applications */}
          <div className="w-full">
            <div className="card bg-white-900 shadow-xl text-black p-6 relative">
              <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                LEAVE APPLICATIONS
                {/* Plus Button to Add Leave */}
                <button
                  className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => setIsModalOpen(true)}
                >
                  <PlusIcon className="mr-2" size={20} />
                  Add Leave
                </button>
              </h2>

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
                      {false && (
                        <div className="relative inline-block">
                          <button className="text-gray-600 hover:text-gray-900" onClick={toggleMenu}>
                            <span className="text-xl">⋮</span>
                          </button>
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
                      {true && (
                        <div className="relative inline-block">
                          <button className="text-gray-600 hover:text-gray-900" onClick={toggleMenu}>
                            <span className="text-xl">⋮</span>
                          </button>
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
            {/* Modal Component */}
            <LeaveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Leaves;
