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

const OvertimeModal: React.FC<OvertimeModalProps> = ({
  isOpen,
  onClose,
  overtime,
  refresh,
  setMessage,
  setError,
}) => {
  if (!isOpen) return null;

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Current date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);

  // Function to convert the date to Philippine Time (UTC +8)
  const convertToPHTime = (date: Date): Date => {
    const phOffset = 8 * 60; // UTC+8 hours
    const localOffset = date.getTimezoneOffset(); // Local timezone offset in minutes
    const offsetDifference = phOffset - localOffset;

    date.setMinutes(date.getMinutes() + offsetDifference); // Adjust the date by the offset difference
    return date;
  };

  // Check if the provided date is in the future
  const isFutureDateNotAllowed =
    (startDate && new Date(startDate) > new Date(today)) ||
    (endDate && new Date(endDate) > new Date(today));

  useEffect(() => {
    if (overtime) {
      const adjustedStartDate = overtime.startDate
        ? convertToPHTime(new Date(overtime.startDate))
        : null;
      const adjustedEndDate = overtime.endDate
        ? convertToPHTime(new Date(overtime.endDate))
        : null;

      // Format the date in the YYYY-MM-DDTHH:MM format for datetime-local
      setStartDate(
        adjustedStartDate ? adjustedStartDate.toISOString().slice(0, 16) : ""
      );
      setEndDate(
        adjustedEndDate ? adjustedEndDate.toISOString().slice(0, 16) : ""
      );
      setReason(overtime.reason || "");
    } else {
      setStartDate("");
      setEndDate("");
      setReason("");
    }
  }, [overtime]);

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

    // Use the PH time converted dates
    const payload = overtime
      ? { id: overtime.id, startDate, endDate, reason }
      : { employeeId, startDate, endDate, reason };

    try {
      const res = await fetch(`/employeeAPI/overtime`, {
        method: overtime ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(overtime ? { ...payload, id: overtime.id } : payload),
      });

      if (!res.ok) throw new Error("Failed to submit overtime");

      if (payload.id !== undefined) {
        setMessage("Overtime Updated Successfully!");
        setError("success");
      } else {
        setMessage("Overtime Added Successfully!");
        setError("success");
      }

      refresh();
      onClose();
    } catch (error) {
      setMessage(`${error}`);
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
        <h2 className="text-lg font-semibold mb-4">File Overtime</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date & Time From */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Date & Time From</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded-md"
              required
            />
          </div>

          {/* Date & Time To */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Date & Time To</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded-md"
              required
            />
          </div>

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
