// Error.js
import React, { useEffect } from "react";

const Error = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(""); // Clear the toast message after 4 seconds
    }, 4000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  return (
    <div
      className="toasts position-fixed bg-danger-subtle w-10   "
      style={{ width: "300px", height: "150px" }}
    >
      <div
        className="border-bottom d-flex justify-content-between align-items-center px-2 "
        style={{ width: "100%", height: "40px" }}
      >
        <span className="fs-3 text-danger text-emphasis">Error</span>
        <button
          onClick={() => onClose("")}
          className="toastClose text-danger text-emphasis"
        >
          X
        </button>
      </div>
      <span className="mt-3 ms-2 text-break text-danger text-emphasis ">
        {message}
      </span>
    </div>
  );
};

// Styles for the toast

export default Error;
