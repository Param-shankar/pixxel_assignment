import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDataViewer.css';

const CustomDataViewer = ({
  rotation,
  setrotation,
  selectedDayForCustomData,
  setselectedDayForCustomData,
  responsedata,
  setresponsedata,
  startDate,
  setStartDate,
  endDate,
  setEndDate,

}) => {

  const [data, setData] = useState(null);
  // const [selectedDay, setSelectedDay] = useState(0);
  const [fetched, setfeteched] = useState(false);
  console.log("the day selected", selectedDayForCustomData);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setfeteched(()=>false);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setfeteched(() => false);
  };

  const handleFetchData = async () => {
    if (!startDate || !endDate) return;
    try {
      // Helper function to format date as dd-MM-yyyy
      const formatDate = (date) => {
        const d = date.getDate().toString().padStart(2, "0");
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const y = date.getFullYear();
        return `${y}-${m}-${d}`;
      };
      
      setfeteched(false);
      try {
        const response = await axios.post("/customeviwer", {
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
        });
        // If the backend returns a "data" key with a string, treat as error
        if (response?.data[0].data) {
          setData({ error: response?.data[0]?.data });
          setresponsedata(response?.data[0]?.data);
          console.log("the data is if", response?.data[0]?.data);
          

        } else {
          console.log("the data is else",response.data);
          setresponsedata(response?.data[0].data);
          // setData(response?.data?.data);
        }
      } catch (error) {
        // If backend returns a 400 with a message, show it
        if (
          error.response &&
          error.response.data
        ) {
          console.log(error);
          alert(error.response?.data?.data);
          setData({ error: error.response?.data.data });
          setresponsedata([]);
        } else {
          setData({ error: "Failed to fetch data." });
        }
      }
    } catch (error) {
      // error handling for the some mistmatched data
      setData({ error: "Failed to fetch data." });
    } finally {
      setfeteched(true);
    }
  };

  // Generate array of dates between startDate and endDate (inclusive)
  const getDateArray = (start, end) => {
    if (!start || !end) return [];
    const arr = [];
    let dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };

  const dateArray = getDateArray(startDate, endDate);

  return (
    <div className="customdataviewer-container">
      <div className="customdataviewer-header">Custom Data Viewer</div>
      <div className="customdataviewer-header">{fetched? "data is feteched !!":"load the data"}</div>
      <div className="customdataviewer-date-row">
        <label className="customdataviewer-label">Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="dd-MM-yyyy"
          maxDate={endDate}
          placeholderText="Select start date"
        />
      </div>
      <div className="customdataviewer-date-row">
        <label className="customdataviewer-label">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          dateFormat="dd-MM-yyyy"
          minDate={startDate}
          placeholderText="Select end date"
        />
      </div>
      <div className="customdataviewer-day-picker-row">
        {dateArray.map((date, idx) => (
          <button
            key={idx}
            className={`customdataviewer-day-btn${
              selectedDayForCustomData === idx + 1 ? " selected" : ""
              }`}
            onClick={() => setselectedDayForCustomData(idx + 1)}>
            {date.toLocaleDateString("en-CA")}
          </button>
        ))}
      </div>
      <button
        className="customdataviewer-fetch-btn"
        onClick={handleFetchData}
        disabled={!startDate || !endDate}>
        Fetch Data
      </button>
    </div>
  );
};

export default CustomDataViewer; 