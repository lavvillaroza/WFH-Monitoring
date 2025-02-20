"use client";

import Navbar from "@/app/navbar/page";
import NavbarEmployer from "@/app/navbarEmployer/page";


const Dashboard = () => {
  return (
    <div className="min-h-screen shadow-md bg-white">
      <NavbarEmployer /> {/* Navbar stays fixed at the top */}

      {/* Adds spacing below the navbar */}
      <div className="container mx-auto p-2 mt-2">
        <div className="space-y-6">
          {/* Row 1 - 1 Card */}
          <div className="grid grid-cols-1">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">Row 1 - Card 1</div>
          </div>

          {/* Row 2 - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gray-700 shadow-md text-white shadow-md text-white shadow-xl p-10">Row 2 - Card 1</div>
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">Row 2 - Card 2</div>
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">Row 2 - Card 3</div>
          </div>

          {/* Row 3 - 1 Card */}
          <div className="grid grid-cols-1">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">Row 3 - Card 1</div>
          </div>

          {/* Row 4 - 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">Row 4 - Card 1</div>
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">Row 4 - Card 2</div>
          </div>

          {/* Row 5 - 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">Row 5 - Card 1</div>
            <div className="card bg-gray-700 shadow-md text-white shadow-xl p-10">Row 5 - Card 2</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
