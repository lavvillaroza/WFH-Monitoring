import React from "react";

interface TrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
  setMessage: (message: string) => void;
  countdown: number; // Receiving the countdown timer
}

const TrackerModal: React.FC<TrackerModalProps> = ({ isOpen, onClose, countdown }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Attention!</h2>
        <p className="mt-2">You have been inactive. Please confirm your presence.</p>
        
        {/* Display the countdown timer */}
        <p className="mt-2 text-red-600 font-bold">Time remaining: {countdown} seconds</p>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackerModal;
