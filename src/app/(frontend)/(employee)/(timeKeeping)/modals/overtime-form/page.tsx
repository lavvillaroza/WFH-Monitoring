"use client";

import { useState, useEffect } from "react";

type OvertimeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    overtime?: any;
    refresh: () => void;
    setMessage: (message: string) => void; 
    setError: (message: string) => void;
  };

const OvertimeModal: React.FC<OvertimeModalProps> = ({ isOpen, onClose, overtime, refresh, setMessage,setError }) => {
  if (!isOpen) return null; // Ensure modal only renders when isOpen is true

  const [dateTimeFrom, setDateTimeFrom] = useState<string>("");
  const [dateTimeTo, setDateTimeTo] = useState<string>("");
  const [overtimeHours, setOvertimeHours] = useState<string>("0");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Function to calculate overtime hours automatically
  // useEffect(() => {
  //   if (dateTimeFrom && dateTimeTo) {
  //     const fromTime = new Date(dateTimeFrom);
  //     const toTime = new Date(dateTimeTo);

  //     if (toTime > fromTime) {
  //       const diffMs = toTime.getTime() - fromTime.getTime(); // Get difference in milliseconds
  //       const diffHours = diffMs / (1000 * 60 * 60); // Convert to hours
  //       setOvertimeHours(diffHours.toFixed(2));
  //     } else {
  //       setOvertimeHours("0");
  //     }
  //   }
  // }, [dateTimeFrom, dateTimeTo]);

  const today = new Date().toISOString().slice(0, 10);
  const isFutureDateNotAllowed = (dateTimeFrom > today || dateTimeTo > today);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFutureDateNotAllowed) {
      setMessage("Future dates are not allowed for Overtime!");
      setError("error");
      return;
    }
    setLoading(true);
    setMessage("");

    const authToken = localStorage.getItem("authToken");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const employeeId = storedUser?.employeeId;
    const payload = overtime ? { id: overtime.id, dateTimeFrom, dateTimeTo, reason } : { employeeId,  dateTimeFrom, dateTimeTo, reason };

    try {
      const res = await fetch(`/employeeAPI/overtime`, {
        method: overtime ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(overtime ? { ...payload, id: overtime.id } : payload),
      });

      if (!res.ok) throw new Error("Failed to submit leave");
      if(payload.id != undefined){
        setMessage("Overtime Updated Successfully!");
        setError("success"); 
      }
      else{
        setMessage("Overtime Added Successfully!"); 
        setError("success");
      }
      refresh();
      onClose();
    } catch (error) {
      setMessage(""+error); 
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96  text-black">
        <h2 className="text-lg font-semibold mb-4">File Overtime</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date & Time From */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Date & Time From</label>
            <input
              type="datetime-local"
              value={dateTimeFrom}
              onChange={(e) => setDateTimeFrom(e.target.value)}
              className="border p-2 rounded-md"
              required
            />
          </div>

          {/* Date & Time To */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Date & Time To</label>
            <input
              type="datetime-local"
              value={dateTimeTo}
              onChange={(e) => setDateTimeTo(e.target.value)}
              className="border p-2 rounded-md"
              required
            />
          </div>

          {/* Overtime Hours (Auto-Computed) */}
          {/* <div className="flex flex-col">
            <label className="text-sm font-medium">Total Overtime Hours</label>
            <input
              type="text"
              value={overtimeHours}
              readOnly
              className="border p-2 rounded-md bg-gray-100"
            />
          </div> */}

          {/* Reason for Overtime */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Reason for Overtime</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border p-2 rounded-md bg-white"
              rows={3}
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-400 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OvertimeModal;