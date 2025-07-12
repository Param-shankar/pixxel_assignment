import React from "react";
import "./TimeSlider.css";

function TimeSlider({
  startDate = "XX:XX:XXXX",
  endDate = "XX:XX:XXXX",
  seletectedday = 1,
  data,
  setseletectedday,
}) {
  return (
    <div className="sidebar-time-slider-container">
      <div className="sidebar-date-headings">
        <div className="sidebar-date-heading">Start: {startDate}</div>
        <div className="sidebar-date-heading">End: {endDate}</div>
      </div>
      <div className="sidebar-day-picker-row">
        {[...Array(7)].map((_, i) => (
          <button
            key={i}
            className={`sidebar-day-picker-btn${
              seletectedday === i + 1 ? " selected" : ""
            }`}
            onClick={() => {
              setseletectedday(i + 1);
            }}>
            Day {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TimeSlider;
