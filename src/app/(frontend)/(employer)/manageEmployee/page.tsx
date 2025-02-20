"use client";

import NavbarEmployer from "@/app/navbarEmployer/page";
import { useState } from "react";
import { employees as initialEmployees } from "../dummyData";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
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
        <div className="flex  justify-between mb-4">
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

        {/* Employee Table */}
        <table className="w-full custom-card-bg border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Job</th>
              <th className="border p-2 text-center">Status</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="border p-2 text-left">{emp.name}</td>
                  <td className="border p-2 text-left">{emp.job}</td>
                  <td className="border p-2 text-center">{emp.status}</td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
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

        {/* Edit Employee Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
              <input
                className="border p-2 w-full mb-2"
                type="text"
                value={selectedEmployee.name}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })}
              />
              <input
                className="border p-2 w-full mb-2"
                type="text"
                value={selectedEmployee.job}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, job: e.target.value })}
              />
              <button className="bg-green-500 text-white px-4 py-2 rounded mr-2" onClick={handleSave}>
                Save
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Employee Modal */}
        {isAdding && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-xl font-bold mb-4">Add Employee</h2>
              <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
              <input
                className="border p-2 w-full mb-2"
                type="text"
                placeholder="Job"
                value={newEmployee.job}
                onChange={(e) => setNewEmployee({ ...newEmployee, job: e.target.value })}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleAdd}>
                Add
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEmployees;
