import React, { useState, useEffect } from "react";

const EditEmployeeModal = ({
  isOpen,
  onClose,
  employee,
  onUpdate,
  alertMessage,
  setAlertMessage,
  setNewEmployee,
  newEmployee,
  setNewUser,
  newUser,
}) => {
  const [initialEmployeeData, setInitialEmployeeData] = useState(null); // Track initial employee data

  useEffect(() => {
    if (employee) {
      setInitialEmployeeData(employee); // Store the initial data
      setNewEmployee({
        name: employee.name || "",
        email: employee.email || "",
        position: employee.position || "",
        department: employee.department || "",
        contactNumber: employee.contactNumber || "",
        address: employee.address || "",
      });
      setNewUser({
        password: "",
        role: employee.role || "",
        status: employee.status || "",
        email: employee.email || "",
        name: employee.name || "",

      });
    } else {
      setInitialEmployeeData(null); // Reset initial data when no employee
      setNewEmployee({
        name: "",
        email: "",
        position: "",
        department: "",
        contactNumber: "",
        address: "",
      });
      setNewUser({
        password: "",
        role: "",
      });
    }
  }, [employee, setNewEmployee, setNewUser]);

  const hasChanges = () => {
    // Check if there are any changes in the employee data
    return (
      newEmployee.name !== initialEmployeeData?.name ||
      newEmployee.email !== initialEmployeeData?.email ||
      newEmployee.position !== initialEmployeeData?.position ||
      newEmployee.department !== initialEmployeeData?.department ||
      newEmployee.contactNumber !== initialEmployeeData?.contactNumber ||
      newEmployee.address !== initialEmployeeData?.address ||
      newUser.role !== initialEmployeeData?.role ||
      newUser.password !== ""
    );
  };

  const handleUpdate = async () => {
    try {
      if (!hasChanges()) {
        // If no changes, don't show the alert and just return
        onClose();
        return;
      }

      if (
        !newEmployee.name ||
        !newEmployee.email ||
        !newEmployee.position ||
        !newUser.password ||
        !newUser.role
      ) {
        setAlertMessage("⚠️ Please fill in all required fields (Name, Email, Position, Password, Role).");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmployee.email)) {
        setAlertMessage("⚠️ Warning: Invalid email address!");
        return;
      }

      setAlertMessage("");

      const updatedUser = { ...newUser, name: newEmployee.name, email: newEmployee.email };
      setNewUser(updatedUser);

      const userResponse = await fetch(`/employerAPI/editUser/${employee.employeeId}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to update user");
      }

      const updatedEmployeeData = { ...newEmployee, employeeId:newEmployee.employeeId,name: newEmployee.name, email: newEmployee.email ,position:newEmployee.position ,department:newEmployee.department,contactNumber:newEmployee.contactNumber,address:newEmployee.address}; // Use `id` instead of `userId`
      setNewEmployee(updatedEmployeeData)
      const employeeResponse = await fetch(`/employerAPI/editEmployee/${employee.employeeId}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployeeData),
      });

      if (!employeeResponse.ok) {
        throw new Error("Failed to update employee");
      }

      setAlertMessage("✅ Employee updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("❌ Error editing employee:", error);
      setAlertMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>
          {alertMessage && (
            <div
              role="alert"
              className="alert alert-warning flex items-center gap-2 p-3 rounded bg-yellow-100 text-yellow-700 border border-yellow-400"
            >
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

          {/* Form fields here */}
          <select
            className="border p-2 rounded w-full mb-2 mt-5 custom-input-bg"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="">Select Role</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="ADMIN">Admin</option>
          </select>

          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded w-full mb-2 custom-input-bg"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded w-full mb-2 custom-input-bg"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full mb-2 custom-input-bg"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <input
            type="text"
            placeholder="Position"
            className="border p-2 rounded w-full mb-2 custom-input-bg"
            value={newEmployee.position}
            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            className="border p-2 rounded w-full mb-2 custom-input-bg"
            value={newEmployee.department}
            onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
          />
          <input
            type="text"
            placeholder="Contact no."
            className="border p-2 rounded w-full mb-2 custom-input-bg"
            value={newEmployee.contactNumber}
            onChange={(e) => setNewEmployee({ ...newEmployee, contactNumber: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-2 rounded w-full mb-2 custom-input-bg"
            value={newEmployee.address}
            onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
          />

          <div className="flex justify-end">
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditEmployeeModal;
