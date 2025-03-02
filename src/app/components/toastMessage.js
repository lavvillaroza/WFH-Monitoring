import React from 'react'

function ToastMessage({alertMessage}) {
  return (
    <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>{alertMessage}</span>
          </div>
        </div>
  )
}

export default ToastMessage;