import React from "react";

const ViewAttendanceModal = ({ isModalOpen, closeModal,employee }) => {
  return (
    <div>
      {/* Modal Dialog */}
      <dialog
        id="attendance_modal"
        className="modal"
        open={isModalOpen} // The modal will be open based on the isModalOpen state
      >
        <div className="modal-box w-11/12 max-w-5xl bg-white">
          <h3 className="font-bold text-lg">View Attendance</h3>
          {employee ? (
            <p className="py-4">Name: {employee.name}</p> // Display employee name
          ) : (
            <p className="py-4">No employee selected.</p>
          )}
          {/* Close button */}
          <div className="modal-action">
            <form method="dialog">
              {/* This button closes the modal */}
              <button
                className="btn"
                onClick={() => {
                  document.getElementById('attendance_modal').close(); // Close modal
                  closeModal(); // Close modal state from parent
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ViewAttendanceModal;
