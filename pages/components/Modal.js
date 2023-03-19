import React from "react";

export default function Modal({ onClose, responseText, isLoading }) {
  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          // Show the loading spinner when isLoading is true
          <div className="loading-spinner"></div>
        ) : (
          // Show the responseText when isLoading is false
          <p>{responseText}</p>
        )}
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
