"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ToastMessage from "@/app/components/toastMessage";

const RegisterEmployee = ( ) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    
    name: "",
    email: "",
    position: "",
    department: "",
    contactNumber: "",
    address: "",
  });

  const router = useRouter();
  const [newUser, setNewUser] = useState({
    password: "",
    status: "Active",
    name: "",
    email: "",
    role: "",
  });

  const handleCancel = async ()=>{
    router.push("/")
  }

  const handleRegister = async () => {
    try {
      const response = await fetch("/employerAPI/register");
      if (!response.ok) {
        throw new Error("Failed to fetch employee ID");
      }
      const data = await response.json();
      const employeeId = data.employeeId;

      if (!newEmployee.name || !newEmployee.email || !newEmployee.position || !newUser.password || !newUser.role) {
        setAlertMessage("⚠️ Please fill in all required fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmployee.email)) {
        setAlertMessage("⚠️ Invalid email address!");
        return;
      }

      setAlertMessage("");

      const userData = {
        ...newUser,
        employeeId,
        name: newEmployee.name,
        email: newEmployee.email,
        status: "Active",
      };

      const userResponse = await fetch("/employerAPI/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to create user");
      }

      const employeeData = {
        ...newEmployee,
        employeeId,
      };

      const employeeResponse = await fetch("/employerAPI/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!employeeResponse.ok) {
        throw new Error("Failed to register employee");
      }
      setAlertMessage("Registered succesfully. Redirecting....")
      setShowToast(true); // Show toast message
      setNewEmployee({ name: "", email: "", position: "", department: "", contactNumber: "", address: "" });
      setNewUser({ password: "", status: "Active", name: "", email: "", role: "" });
      setTimeout(() => {
        router.push("/"); 
      }, 2000);

    } catch (error) {
      setAlertMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Register Employee</h2>
        {alertMessage && <div className="text-red-500 mb-2">{alertMessage}</div>}

        <select
          className="border p-2 rounded w-full mb-2 bg-white text-gray-700"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="ADMIN">Admin</option>
        </select>

        <input type="text" placeholder="Name" className="border p-2 rounded w-full mb-2" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
        <input type="email" placeholder="Email" className="border p-2 rounded w-full mb-2" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border p-2 rounded w-full mb-2" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <input type="text" placeholder="Position" className="border p-2 rounded w-full mb-2" value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} />
        <input type="text" placeholder="Department" className="border p-2 rounded w-full mb-2" value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} />
        <input type="text" placeholder="Contact no." className="border p-2 rounded w-full mb-2" value={newEmployee.contactNumber} onChange={(e) => setNewEmployee({ ...newEmployee, contactNumber: e.target.value })} />
        <input type="text" placeholder="Address" className="border p-2 rounded w-full mb-2" value={newEmployee.address} onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })} />

        <div className="flex justify-end">
          <button className="bg-gray-400 text-white px-4 py-2 rounded mr-2"  onClick={handleCancel}>Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleRegister}>Register</button>
        </div>
      </div>
      {showToast && (
      <ToastMessage alertMessage={alertMessage}/>
      )}
      

    </div>
    
  );
};

export default RegisterEmployee;
