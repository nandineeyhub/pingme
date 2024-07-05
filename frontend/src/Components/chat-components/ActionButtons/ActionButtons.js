import React from "react";

const ActionButtons = ({ submitText = "Submit", submitFn, cancelFn }) => {
  return (
    <div className="d-flex justify-content-end align-items start gap-2 mt-3">
      <button
        className="btn btn-secondary"
        onClick={() => {
          if (cancelFn) cancelFn();
        }}
      >
        Cancel
      </button>
      <button
        className="submitBtn"
        onClick={() => {
          if (submitFn) submitFn();
        }}
      >
        {submitText}
      </button>
    </div>
  );
};

export default ActionButtons;
