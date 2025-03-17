import React, { useEffect } from "react";

interface TrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
  message: string;
}

const TimeOutModal: React.FC<TrackerModalProps> = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleYes = () => {
    console.log("Yes clicked");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold text-gray-800">Attention!</h2>
        <p className="mt-2 text-gray-600">{message}</p>

        <div className="mt-4 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            No
          </button>
          <button onClick={handleYes} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeOutModal;
