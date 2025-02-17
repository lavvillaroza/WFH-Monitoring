"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const router = useRouter(); // Use Next.js router

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Username and password cannot be empty!");
      setMessageType("error");
    } else {
      setMessage("Logging in...");
      setMessageType("success");

      setTimeout(() => {
        setMessage(""); 
        router.push("/dashboard"); // Redirect to dashboard after login
      }, 2000);
    }
  };

 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white " >
      {message && (
        <div className={`absolute top-4 right-4 p-3 rounded-lg shadow-lg border ${messageType === "error" ? "bg-red-600 border-red-800" : "bg-green-600 border-green-800"} text-white`}>
          {message}
        </div>
      )}
      <div className="card w-96 bg-gray-600 shadow-xl border border-[#2C6975] text-white">
        <div className="card-body">
          <h2 className="card-title">Welcome to Next.js App with DaisyUI!</h2>
          <p>Please login to continue</p>
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
          <div className="card-actions justify-end">
            <button className="btn bg-[#2C6975] hover:bg-gray-600 text-white" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;