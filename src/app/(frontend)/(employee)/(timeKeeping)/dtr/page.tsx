"use client";

import Navbar from "@/app/navbar/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DTR = () => {
  const [dtrData, setDtrData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const router = useRouter();
  // const [FirstTimeIn, setFirstTimeIn] = useState<any>(null);
  // const [LastTimeOut, setLastTimeOut] = useState<any>(null);
  // const [HoursRendered, setHoursRendered] = useState<string>("");

  useEffect(() => {
    fetchDTR();
  }, []);

  const fetchDTR = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        router.push("/");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const employeeId = storedUser?.employeeId;

      if (!employeeId) {
        setMessage("User ID not found");
        setMessageType("error");
        return;
      }

      const queryParams = new URLSearchParams({ employeeId });
      const res = await fetch(`/employeeAPI/dtr?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const data = await res.json();

      setDtrData(Array.isArray(data.dtrData) ? data.dtrData : []);

      console.log(data.getAllData)
      // const totalSeconds = Math.floor(data.hoursRendered || 0); // Ensure integer value
      // const hours = Math.floor(totalSeconds / 3600);
      // const minutes = Math.floor((totalSeconds % 3600) / 60);
      // const seconds = Math.floor(totalSeconds % 60); // Ensure integer

      // const formattedTime = `${hours} hrs ${minutes} mins ${seconds} secs`;

      // setHoursRendered(formattedTime);
      setLoading(false);
    } catch (error) {
      setMessage("Error fetching DTR data");
      setMessageType("error");
      setLoading(false);
    }
  };
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const filteredData = dtrData.filter(
    (record) => record.date && new Date(record.date).toISOString().split("T")[0] === today
  );
  
  return (
    <div className="min-h-screen shadow-md bg-white">
      <Navbar />
      {message && (
        <div
          className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg border ${
            messageType === "error"
              ? "bg-red-600 border-red-800"
              : "bg-green-600 border-green-800"
          } text-white z-50`}
        >
          {message}
        </div>
      )}
      <div className="container mx-auto p-2 mt-2 text-black">
        <div className="space-y-6">
          <div className="overflow-x-auto h-[420px]">
            <table className="table table-xs w-full">
              <thead>
                <tr className="bg-gray-200 sticky top-0">
                  <th>Date</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Hours Rendered</th>
                </tr>
              </thead>
              <tbody>
              {dtrData.length > 0 ? (
                dtrData
                  .filter((record) => record.date && new Date(record.date) <= new Date()) // Include today's and past dates
                  .map((record: any, index: number) => (
                    <tr key={index}>
                      <td>{record.date ? new Date(record.date).toISOString().split("T")[0] : "N/A"}</td>
                      <td>
                        {record.firstTimeIn
                          ? new Date(record.firstTimeIn).toLocaleTimeString()
                          : "N/A"}
                      </td>
                      <td>
                        {record.lastTimeOut
                          ? new Date(record.lastTimeOut).toLocaleTimeString()
                          : "N/A"}
                      </td>
                      <td>{record.hoursRendered ? `${record.hoursRendered}` : "0 hrs"}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">No DTR records available.</td>
                </tr>
              )}
            </tbody>



            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DTR;
