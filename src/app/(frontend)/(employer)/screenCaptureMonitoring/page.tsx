"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import NavbarEmployer from "@/app/navbarEmployer/page";
import { Doughnut } from "react-chartjs-2";
import { useRouter } from "next/navigation";

import Image from "next/image";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmployeeMonitoring = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortStatus, setSortStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/");
    } else {
      setIsFullScreenLoading(true); // Show loader
      fetchEmployees().finally(() => setIsFullScreenLoading(false)); // Hide loader after fetch
      
    }
  }, []);
  
  const handleDateFilter = async () => {
    if (!selectedEmployee || !startDate || !endDate) return;
  
    const startDateUTC = new Date(startDate).toISOString();
    const endDateUTC = new Date(endDate).toISOString();
  
    setIsFullScreenLoading(true); // Show loader
  
    try {
      const res = await fetch(
        `/employerAPI/screenShot?employeeId=${selectedEmployee.employeeId}&startDate=${startDateUTC}&endDate=${endDateUTC}`
      );
      if (!res.ok) throw new Error("Failed to fetch screenshots");
  
      const data = await res.json();
      setScreenshots(data.screenshots);
    } catch (error) {
      console.error("Error fetching filtered screenshots:", error);
      setScreenshots([]);
    } finally {
      setIsFullScreenLoading(false); // Hide loader after fetching
    }
  };
  

  const fetchEmployees = async () => {
    try {
      // Fetch employee data
      const employeeResponse = await fetch("/employerAPI/employee");
      if (!employeeResponse.ok) {
        throw new Error("Failed to fetch employees");
      }
      const employeesData = await employeeResponse.json();
  

      const userResponse = await fetch("/employerAPI/user");
      if (!userResponse.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await userResponse.json();
  
      const employeesWithStatus = employeesData
            .map((employee) => {
              const user = usersData.find((user) => user.email === employee.email);

              if (user && user.status !== "RESIGN") {
                return {
                  ...employee,
                  status: user.status,
                  password: user.password, 
                  role: user.role,
                };
              }

              return null; // Mark employees to be excluded
            })
            .filter(Boolean); // Remove `null` values (employees with "RESIGN" status)


      
      setEmployees(employeesWithStatus);
    } catch (error) {
      console.error("Error fetching employees or users:", error);
    }
  };
  
  console.log(employees)

  const fetchScreenshots = async (employeeId, page = 1) => {
    try {
      setIsFullScreenLoading(true);
      const res = await fetch(`/employerAPI/screenShot?employeeId=${employeeId}&page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch screenshots");
  
      const data = await res.json();
      setScreenshots(data.screenshots);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching screenshots:", error);
      setScreenshots([]);
    } finally {
      setIsFullScreenLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Idle":
        return "text-[#FFC107]";
      case "Active":
        return "text-green-500";
      case "On Leave":
        return "text-red-500";
      case "Sleeping":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    fetchScreenshots(employee.employeeId);
  };

  const filteredEmployees = employees
  .filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter((employee) => 
    sortStatus === "All" || employee.activityStatus === sortStatus
  );

  return (
    <div className="min-h-screen bg-white">
      <NavbarEmployer />
      <div className="container mx-auto p-4 mt-4">
        {/* Search and Sort */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md"
          />
          <select
            className="p-2 border rounded-md bg-white text-gray-500"
            value={sortStatus}
            onChange={(e) => setSortStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Idle">Idle</option>
            <option value="On Leave">On Leave</option>
            <option value="Sleeping">Sleeping</option>
          </select>
        </div>

      {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="relative bg-white shadow-lg p-4 rounded-lg cursor-pointer hover:shadow-xl flex flex-col items-center w-60"
              onClick={() => handleEmployeeClick(employee)}
            >
              {/* Profile Picture */}
              <Image
                src="/img/user-icon.png"
                alt="User Icon"
                width={60}
                height={60}
                className="w-14 h-14 rounded-full object-cover"
              />

              {/* Employee Details */}
              <div className="flex flex-col items-center text-center w-full mt-2">
                <p className="text-md font-semibold text-gray-800 break-words w-full mb-2">
                  {employee.name}
                </p>
              </div>

              {/* Status - Positioned at Bottom Right */}
              <p className={`text-sm font-medium ${getStatusColor(employee.status === "ACTIVE" ?  employee.activityStatus : employee.status)}`}>
                     {(employee.status === "ACTIVE" ?  employee.activityStatus : employee.status).toUpperCase()}
              </p>
            </div>
          ))}
        </div>


            {/* Employee Details Modal */}
        {isModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl flex flex-col max-h-[80vh]">
              <h2 className="text-xl font-semibold text-gray-500">{selectedEmployee.name}</h2>

              {/* Date Range Filter */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full p-2 border bg-white text-black appearance-auto [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full p-2 border bg-white text-black appearance-auto [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

                <button onClick={handleDateFilter} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6">
                  Apply
                </button>
              </div>
             


              {/* Scrollable Content Area */}
              <div className="mt-4 flex-1 overflow-y-auto">
                <h3 className="text-lg font-semibold">Screenshots</h3>
                {screenshots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                    {screenshots.map((screenshot, index) => (
                      <div key={index} className="border rounded-lg p-2">
                        <label className="text-xs font-medium text-gray-700 block text-center mb-1">
                          {new Date(screenshot.createdAt).toLocaleString()}
                        </label>
                        <img
                          src={screenshot.image}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-auto rounded-md cursor-pointer"
                          onClick={() => setSelectedImage(screenshot.image)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No screenshots available.</p>
                )}
                {isLoading && <span className="loading loading-bars loading-xl text-warning text-center"></span>}
              </div>
               {/* Pagination Controls */}
               <div className="flex justify-between mt-4">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => fetchScreenshots(selectedEmployee.employeeId, currentPage - 1)}
                  >
                    Previous
                  </button>

                  <span className="text-gray-700">Page {currentPage} of {totalPages}</span>

                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={currentPage >= totalPages}
                    onClick={() => fetchScreenshots(selectedEmployee.employeeId, currentPage + 1)}
                  >
                    Next
                  </button>
                </div>

              {/* Stuck at Bottom - Close Button */}
              <div className="sticky bottom-0 left-0 bg-white py-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Image Preview Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Enlarged Screenshot" className="max-w-full max-h-full rounded-lg shadow-lg" />
          </div>
        )}
      </div>
      {isFullScreenLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <span className="loading loading-infinity w-32 h-32 text-info"></span>
        </div>
      )}
    </div>
    
  );
};

export default EmployeeMonitoring;
