"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const router = useRouter();
  



const handleRegister = async() => {
router.push("/register");
}

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password cannot be empty!");
      setMessageType("error");
      return;
    }
  
    try {
      const response = await fetch(`/employeeAPI/user?email=${email}&password=${password}`, { 
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error);
      }
      setMessage("Login successful!");
      setMessageType("success");
    localStorage.setItem("user", JSON.stringify({ 
         id: data.user.id,
         name: data.user.name, 
         email: data.user.email
       }));
    localStorage.setItem("authToken", data.token);
    
      setTimeout(() => {
        setMessage("");
        
         // Redirect based on role
      if (data.user.role === "ADMIN") {
        router.push("/admin-dashboard");
      } else if (data.user.role === "EMPLOYEE") {
        router.push("/employee-dashboard");
      } else {
        router.push("/employerDashboard"); // Default fallback
      }

      }, 2000);
    } catch (error: any) {
      setMessage(error.message);
      setMessageType("error");
    }
  };
  

  const handleShowPassword = async() =>{
    setshowPassword((prev) => !prev);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {message && (
        <div className={`absolute top-4 right-4 p-3 rounded-lg shadow-lg border ${messageType === "error" ? "bg-red-600 border-red-800" : "bg-green-600 border-green-800"} text-white`}>
          {message}
        </div>
      )}
      <div className="card w-96 bg-white-600 shadow-xl border border-[#2C6975] text-black">
        <div className="card-body">
          <h2>LOGIN</h2>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mt-2 bg-white-100 text-black border-[#2C6975]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input input-bordered w-full mt-2 bg-white-100 text-black border-[#2C6975]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p><input
            type="checkbox"
            placeholder="Password"
            className=" mt-2 bg-white-100 text-black border-[#2C6975]"
            onClick={handleShowPassword}
          /> Show Password</p>
          <div className="card-actions justify-end">
            <button className="btn bg-[#2C6975] hover:bg-gray-600 bg-black text-white" onClick={handleLogin}>Login</button>
          </div>
          <a onClick={handleRegister}>Click here to register.</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
