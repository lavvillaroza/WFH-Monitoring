import React from "react";
import { useRouter } from "next/navigation";

const DeleteEmployeeModal = ({ isOpen, onClose, employee, alertMessage, onDelete }) => {
  if (!isOpen) return null;

  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/employerAPI/deleteUser/${employee.employeeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      onClose(); 
      router.push("/manageEmployee")
    } catch (error) {
      console.error("❌ Error deleting employee:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Delete Employee</h2>

        {alertMessage && (
          <div className="alert alert-warning flex items-center gap-2 p-3 rounded bg-yellow-100 text-yellow-700 border border-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{alertMessage}</span>
          </div>
        )}

        <p className="text-gray-600 mb-4">
          Are you sure you want to delete <strong>{employee?.name}</strong>? This action cannot be undone.
        </p>

        <div className="flex justify-end">
          <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeModal;
