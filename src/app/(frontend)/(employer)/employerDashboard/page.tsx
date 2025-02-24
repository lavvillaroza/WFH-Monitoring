"use client";


import { employees, Employee } from "../dummyData";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import NavbarEmployer from "@/app/navbarEmployer/page";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [sortStatus, setSortStatus] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Manila", // Set to PH timezone
    });
    setTodayDate(date);
  }, []);

 

  const calculateAverageProductivity = () => {
    const totalEmployees = employees.length;
    const totalProductive = employees.reduce((sum, emp) => sum + (emp.productivity?.productive || 0), 0);
    const totalIdle = employees.reduce((sum, emp) => sum + (emp.productivity?.idle || 0), 0);
    
    return {
      productive: totalEmployees ? totalProductive / totalEmployees : 0,
      idle: totalEmployees ? totalIdle / totalEmployees : 0,
    };
  };

  const getDonutData = (employee: Employee | null) => {
    if (!employee) {
      const avg = calculateAverageProductivity();
      return {
        labels: ["Productive Tasks", "Idle Time"],
        datasets: [{
          data: [avg.productive, avg.idle],
          backgroundColor: ["#4CAF50", "#FFC107"],
          hoverBackgroundColor: ["#45a049", "#ffca2c"],
        }],
      };
    }
    return {
      labels: ["Productive Tasks", "Idle Time"],
      datasets: [{
        data: [employee.productivity?.productive || 0, employee.productivity?.idle || 0],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#ffca2c"],
      }],
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarEmployer />
      <div className="container mx-auto p-4 mt-4">
        <div className="space-y-6">
          <div className="flex gap-4">
            
           {/* Employee list */}
            {/* <div className="w-[30%] bg-white shadow-lg p-6 rounded-lg h-screen">
              <h2 className="text-xl font-semibold text-gray-700">Employee List</h2>
              <select
                className="mt-3 w-full p-2 border bg-white rounded-md text-gray-700"
                value={sortStatus}
                onChange={(e) => setSortStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="On Meeting">On Meeting</option>
              </select>
              <div className="mt-4 space-y-3">
                {employees.filter(emp => sortStatus === "All" || emp.status === sortStatus)
                  .map((employee) => (
                    <div key={employee.id} className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-gray-200" onClick={() => setSelectedEmployee(employee)}>
                      <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
                      <p className={`mt-1 text-sm font-medium ${getStatusColor(employee.status)}`}>{employee.status}</p>
                    </div>
                ))}
              </div>
            </div> */}


        {/* Employee List */}
          <div className="w-[50%] h-[50vh] overflow-y-auto p-4 bg-white shadow-lg rounded-lg flex flex-col items-start justify-start text-left">
            <p className="text-md text-gray-500 mb-2">{todayDate}</p>
            <h2 className="text-lg font-semibold pb-3 text-gray-700">Employee Activity Chart</h2>
            <p className="text-md text-gray-600 mb-2">
              Total Employees: <span className="font-bold">{employees.length}</span>
            </p>

            {/* Doughnut Chart & Labels */}
            <div className="flex items-center w-full">
              {/* Doughnut Chart */}
              <div className="w-[280px] h-[280px]"> 
                <Doughnut data={getDonutData(selectedEmployee)} options={{ maintainAspectRatio: false }} />
              </div>

              {/* Labels for Total Time */}
              <div className="ml-6 text-sm text-gray-700">
                <p><span className="font-bold text-green-600">Productive Time:</span> 70 hrs</p>
                <p><span className="font-bold text-yellow-500">Idle Time:</span> 30 hrs</p>
                <p><span className="font-bold text-red-600">Inactive:</span> 2 </p>
                <p><span className="font-bold text-orange-500">Active:</span> 1 </p>
              </div>
            </div>
          </div>


            <div className="w-[50%] h-[50vh] overflow-y-auto p-3 bg-white shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold pb-3 text-gray-700">Employee Activity Chart</h2>
              <Doughnut data={getDonutData(selectedEmployee)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



