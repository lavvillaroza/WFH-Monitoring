"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, CheckCircle, Settings2Icon } from "lucide-react";
import Image from "next/image";
import { json } from "stream/consumers";

const NavbarEmployer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [settings, setSettings] = useState({
        sleepingThreshold: 0,
        idleThreshold: 0,
        screenshotThreshold: 0,
    });

    const router = useRouter();
    const pathname = usePathname();

    const pageTitles = {
        "/employerDashboard": "Dashboard",
        "/employeeMonitoring": "Employee Monitoring",
        "/approvalRequest": "Approval Request",
        "/manageEmployee": "Manage Employee",
        "/employerReports": "Reports",
        "/screenCaptureMonitoring": "Screen Capture",
    };

    const activePage = pageTitles[pathname] || "Dashboard";

    const handleUpdateAdmin = async (employeeId, action) => {
        try {
          const response = await fetch(`/employerAPI/handleAdminStatus?employeeId=${employeeId}`, {
            method: "PUT", // ✅ Use PUT to match your API
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }), // ✅ Send action as JSON
          });
      
          if (!response.ok) {
            throw new Error("Failed to update employee status");
          }
      
          const data = await response.json();
          console.log("Success:", data.message);
          
        } catch (error) {
          console.error("Error updating employee status:", error);
        }
      };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        const configSettings = await fetch("/employerAPI/configSettings/");
        const configData = await configSettings.json();
    
        if (configData && Array.isArray(configData)) {
            const sleepingThreshold = configData.find(item => item.name === "sleepingThreshold")?.threshold || 1;
            const idleThreshold = configData.find(item => item.name === "idleThreshold")?.threshold || 1;
            const screenshotThreshold = configData.find(item => item.name === "screenShotThreshold")?.threshold || 1;
    
            setSettings({
                sleepingThreshold,
                idleThreshold,
                screenshotThreshold
            });
        }
    };
    

    const handleLogout = () => {
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            const user = JSON.parse(storedUser);
            const employeeId = user.employeeId;
            const role = user.role
            if(role === "ADMIN"){
                handleUpdateAdmin(employeeId,"LOGOUT")
            }
        }
        setProfileOpen(false);
        setLogoutMessage(true);
        setTimeout(() => {
            setLogoutMessage(false);
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            router.push("/");
        }, 2000);
    };

    const handleSettingsChange = async (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: Number(value) }));
        
    };

    const handleSettingsSave = async () => {
        try {
            // Send all settings at once
            const response = await fetch(`/employerAPI/configSettings/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
    
            if (!response.ok) throw new Error("Failed to update settings");
    
            console.log("Thresholds updated successfully!");
    
        } catch (error) {
            console.error("Error updating thresholds:", error);
        }
    };
    

    return (
        <>
            <nav className="bg-white shadow-md text-gray-600 relative z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <button className="md:hidden mr-3" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <div className="hidden md:flex space-x-6">
                            {Object.keys(pageTitles).map((path) => (
                                <Link
                                    key={path}
                                    href={path}
                                    className={`${pathname === path ? "text-gray-700 font-semibold text-lg" : "text-gray-400 text-base"} hover:text-black px-2 py-2 rounded`}
                                >
                                    {pageTitles[path]}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <button className="flex items-center space-x-2 text-black" onClick={() => setProfileOpen(!profileOpen)}>
                            <Image src="/img/user-icon.png" alt="User Icon" width={40} height={40} className="rounded-full" />
                            <span className="text-gray-600">{user ? user.name : "Loading..."}</span>
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                                <div className="p-2 border-b">
                                    <p className="text-sm font-semibold">{user ? user.name : "Unknown"}</p>
                                    <p className="text-xs text-gray-500">{user ? user.email : "No Email"}</p>
                                </div>
                                <button onClick={() => setSettingsOpen(true)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                                    <Settings2Icon className="w-5 h-5 mr-2" /> Settings
                                </button>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center">
                                    <LogOut className="w-5 h-5 mr-2" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {settingsOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4 text-gray-600">Settings</h2>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-600">Sleeping Threshold</label>
                            <input
                                type="number"
                                name="sleepingThreshold"
                                value={settings.sleepingThreshold}
                                onChange={handleSettingsChange}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-600">Idle Threshold</label>
                            <input
                                type="number"
                                name="idleThreshold"
                                value={settings.idleThreshold}
                                onChange={handleSettingsChange}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-600">Screenshot Threshold</label>
                            <input
                                type="number"
                                name="screenshotThreshold"
                                value={settings.screenshotThreshold}
                                onChange={handleSettingsChange}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button onClick={() => setSettingsOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                            <button onClick={() => {setSettingsOpen(false),handleSettingsSave()}} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavbarEmployer;
