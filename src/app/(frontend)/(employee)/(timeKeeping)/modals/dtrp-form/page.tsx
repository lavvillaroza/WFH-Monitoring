"use client";

const DTRPModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Daily Time Record Problem</h2>

        {/* Combo Box for Time In / Time Out */}
        <label className="block mb-2 font-medium">Select Action</label>
        <select className="w-full px-4 py-2 border rounded-md mb-4">
          <option value="time-in">Time In</option>
          <option value="time-out">Time Out</option>
        </select>

        {/* Date and Time Input */}
        <label className="block mb-2 font-medium">Date & Time</label>
        <input type="datetime-local" className="w-full px-4 py-2 border rounded-md mb-4" />

        {/* Remarks Text Area */}
        <label className="block mb-2 font-medium">Remarks</label>
        <textarea
          className="w-full px-4 py-2 border rounded-md mb-4"
          rows="3"
          placeholder="Enter remarks..."
        ></textarea>

        {/* Buttons with spacing */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DTRPModal;
