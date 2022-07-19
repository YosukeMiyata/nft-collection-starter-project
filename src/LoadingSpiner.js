import React from "react";
//import "./spinner.css";
import "./styles/App.css";

export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <p className="sub-text">Loading...</p>
    </div>
  );
}