"use client";

import NavbarEmployer from "@/app/navbarEmployer/page";
import { useEffect, useRef, useState } from "react";
import { FileText, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

const ApprovalRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null); // Manage dropdown state
  const router = useRouter();
  const recordsPerPage = 5;
  const dropdownRef = useRef(null);

  const handleDropdownToggle = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id); // Toggle dropdown
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/");
    } else {
      fetchNotificationLogs();
    }
  }, []);

  const handleMouseLeave = () => {
    setDropdownOpen(null); // Close dropdown when mouse leaves
  };

  const fetchNotificationLogs = async () => {
    try {
      const response = await fetch("/employerAPI/notifications");
      const data = await response.json();
  
      // Merge and sort by createdAt (newest first)
      const mergedRequests = [...(data.latest || []), ...(data.pending || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  
      setRequests(mergedRequests);
      setFilteredRequests(mergedRequests); // Ensure table updates
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notification logs:", error);
      setRequests([]);
      setFilteredRequests([]);
      setLoading(false);
    }
  };
  
  const handleDateRangeChange = () => {
    const filtered = requests.filter((request) => {
      const requestDate = new Date(request.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!start || requestDate >= start) && (!end || requestDate <= end);
    });

    setFilteredRequests(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (request) => {
    console.log("Editing request:", request.id);
    // Add your edit functionality here
  };

  const handleDelete = (request) => {
    console.log("Deleting request:", request);
    // Add your delete functionality here
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRequests.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRequests.length / recordsPerPage);

  return (
    <div className="min-h-screen shadow-md bg-white">
      <NavbarEmployer />

      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* Filters */}
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
          </div>

          {/* Requests Table */}
          <div className="grid grid-cols-1">
            <div className="card bg-white shadow-xl text-black p-10">
              <h2 className="text-xl font-semibold mb-4">REQUESTS LOG</h2>

              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 border-b text-black text-center">Date</th>
                      <th className="px-4 py-2 border-b text-black text-center">Type</th>
                      <th className="px-4 py-2 border-b text-black text-center">Employee ID</th>
                      <th className="px-4 py-2 border-b text-black text-center">Status</th>
                      <th className="px-4 py-2 border-b text-black text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">Loading...</td>
                      </tr>
                    ) : currentRecords.length > 0 ? (
                      currentRecords.map((request) => (
                        <tr key={request.id}>
                          <td className="px-4 py-2 border-b text-black text-center">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 border-b text-black text-center">{request.type}</td>
                          <td className="px-4 py-2 border-b text-black text-center">{request.employeeId}</td>
                          <td
                            className={`px-4 py-2 border-b text-black text-center ${
                              request.status === "PENDING"
                                ? "text-yellow-600"
                                : request.status === "APPROVED"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {request.status}
                          </td>
                          <td className="px-4 py-2 border-b text-black text-center relative">
                        <div className="relative inline-block" ref={dropdownRef} onMouseLeave={handleMouseLeave}>
                          <button
                            className="p-2 rounded-md hover:bg-gray-200"
                            onClick={() => handleDropdownToggle(request.id)}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          {dropdownOpen === request.id && (
                            <div className="absolute right-0 w-32 bg-white border rounded-md shadow-md z-10">
                              <button
                                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                                onClick={() => {
                                  handleEdit(request);  
                                  setIsEditing(true); 
                                }}
                              >
                                Edit
                              </button>
                              <button className="block px-4 py-2 w-full text-left hover:bg-gray-100"  onClick={() => {
                                  setDeleteEmployee(request);  
                                  setIsDeleting(true); 
                                }}>Delete</button>
                              <button
                              className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                              onClick={() => {
                                openModal(emp);
                              }}
                            >
                              View Attendance
                            </button>
                            </div>
                          )}
                        </div>
                        </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">No requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <div className="text-center text-black">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalRequest;
