"use client";

import NavbarEmployer from "@/app/navbarEmployer/page";
import { useState } from "react";
import { employees as initialEmployees } from "../dummyData";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: "", job: "", status: "Active" });

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const handleSave = () => {
    setEmployees(
      employees.map((emp) => (emp.id === selectedEmployee.id ? selectedEmployee : emp))
    );
    setIsEditing(false);
    setSelectedEmployee(null);
  };

  const handleAdd = () => {
    const newEmp = { ...newEmployee, id: employees.length + 1 };
    setEmployees([...employees, newEmp]);
    setIsAdding(false);
    setNewEmployee({ name: "", job: "", status: "Active" });
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (emp.job?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <NavbarEmployer />
      <div className="container mx-auto p-4">
        {/* Search Bar */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search employees..."
            className="border p-2 rounded w-1/3 bg-white text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsAdding(true)}
          >
            Add Employee
          </button>
        </div>

        {/* Employee Table Card */}
        <div className="bg-white shadow-md rounded-lg p-4 border">
          <table className="w-full border-collapse border text-gray-700 border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-center">Name</th>
                <th className="border p-2 text-center">Employee ID</th>
                <th className="border p-2 text-center">Job</th>
                <th className="border p-2 text-center">Status</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="border p-2 text-center">{emp.name}</td>
                    <td className="border p-2 text-center">123</td>
                    <td className="border p-2 text-center">{emp.job}</td>
                    <td className="border p-2 text-center">{emp.status}</td>
                    <td className="px-4 py-2 border-b text-black text-center relative">
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => toggleDropdown(emp.id)}
                      >
                        <span className="text-xl">⋮</span>
                      </button>
                      {dropdownOpen === emp.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                          <button
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => handleEdit(emp)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            onClick={() => handleDelete(emp.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployees;
