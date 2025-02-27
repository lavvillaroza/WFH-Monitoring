"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMessage("All fields are required!");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("/employeeAPI/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "Employee",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage("Registration successful! Redirecting...");
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
        router.push("/"); // Redirect to login page after success
      }, 2000);
    } catch (error: any) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {message && (
        <div
          className={`absolute top-4 right-4 p-3 rounded-lg shadow-lg border ${
            messageType === "error"
              ? "bg-red-600 border-red-800"
              : "bg-green-600 border-green-800"
          } text-white`}
        >
          {message}
        </div>
      )}
      <div className="card w-96 bg-gray-600 shadow-xl border border-[#2C6975] text-white">
        <div className="card-body">
          <p>Registration</p>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full mt-2 bg-gray-600 text-white border-[#2C6975]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mt-2 bg-gray-600 text-white border-[#2C6975]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mt-2 bg-gray-600 text-white border-[#2C6975]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            className="input input-bordered w-full mt-2 bg-gray-600 text-white border-[#2C6975]"
            value="Employee"
            disabled
          />
          <div className="card-actions justify-end">
            <button
              className="btn bg-[#2C6975] hover:bg-gray-600 text-white"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
