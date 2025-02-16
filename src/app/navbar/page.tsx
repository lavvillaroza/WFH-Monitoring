"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, UserCircle, LogOut, CheckCircle, Router } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState(false); // Logout message state
    const router = useRouter();

    
    const handleLogout = () => {
      setProfileOpen(false); // Close the dropdown
      setLogoutMessage(true); // Show success message
  
      setTimeout(() => {
        setLogoutMessage(false); // Hide after 2 seconds
        router.push("/");
      }, 2000);
    };

  return (
    <nav className="bg-gray-800 shadow-md text-white relative z-50"> {/* Gray background */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left Side - Menu */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button className="md:hidden btn btn-ghost text-white mr-3" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Menu (Visible on Medium+ Screens) */}
          <div className="hidden md:flex space-x-6">
            <Link href="/dashboard" className="btn btn-ghost text-white hover:bg-[#0F4A55]">Dashboard</Link>
            <Link href="/user-management" className="btn btn-ghost text-white hover:bg-[#0F4A55]">User Management</Link>
            <Link href="/reports" className="btn btn-ghost text-white hover:bg-[#0F4A55]">Reports</Link>
            <Link href="/profile-update" className="btn btn-ghost text-white hover:bg-[#0F4A55]">Profile</Link>
          </div>
        </div>

        {/* Right Side - Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-2 btn btn-ghost text-white" onClick={() => setProfileOpen(!profileOpen)}>
            <UserCircle className="w-6 h-6" />
            <span>Jaykko Takahashi</span>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
              <div className="p-2 border-b">
                <p className="text-sm font-semibold">Jaykko Takahashi</p>
                <p className="text-xs text-gray-500">jaykkotakahashi1104@gmail.com</p>
              </div>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center">
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu (Hidden by Default, Shown When `isOpen` is True) */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-[#135D66] py-2`}>
        <Link href="/dashboard" className="block px-4 py-2 text-white hover:bg-[#0F4A55]">Dashboard</Link>
        <Link href="/user-management" className="block px-4 py-2 text-white hover:bg-[#0F4A55]">User Management</Link>
        <Link href="/reports" className="block px-4 py-2 text-white hover:bg-[#0F4A55]">Reports</Link>
        <Link href="/profile-update" className="block px-4 py-2 text-white hover:bg-[#0F4A55]">Profile</Link>
      </div>
       {/* Logout Notification Popup (Upper Right Corner) */}
       {logoutMessage && (
        <div className="absolute top-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Logging out
        </div>
      )}
    </nav>
    
  );
};

export default Navbar;
