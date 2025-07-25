import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Earth from "./components/Earth";
import LEOOrbit from "./components/LEO";
import Satellite from "./components/Sat";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Camera } from "three";
import axios from "axios";
import TimeSlider from "./components/TimeSlider";
import CustomDataViewer from "./components/CustomDataViewer";

// replace if data is more zoomed from hour to min/sec
const timeArray = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTimeSlider, setShowTimeSlider] = useState(true);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);

  //initilly at 0,0,0
  const [rotationcube, setrotationcube] = useState([0, 0, 0]);
  const [seletectedday, setseletectedday] = useState(1);
  //[[date, time , [x,y,z]]]
  const [responsedata, setreponsedata] = useState([]);
  const [customviewerdata, setcustomviewerdata] = useState([]);
  const [selectedDayForCustomData, setSelectedDayForCustomData] = useState(1);
  const [Predictedvalue, setPredictedvalue] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  return (
    <div>
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((open) => !open)}
        style={{ zIndex: 200 }}>
        {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>
      <button
        className="sidebar-toggle"
        onClick={() => {
          console.log("clicked");
          setShowTimeSlider((open) => !open);
        }}
        style={{ zIndex: 200, marginLeft: "10vw" }}>
        {showTimeSlider ? "Close TimeSlider" : "Open TimeSlider"}
      </button>
      {showTimeSlider && (
        <div className="time-slider-container">
          <input
            type="range"
            min={0}
            max={timeArray.length - 1}
            value={currentTimeIndex}
            onChange={(e) => {
              console.log("the active menue", activeMenu);
              const newIndex = Number(e.target.value);
              setCurrentTimeIndex(newIndex);
              // Get the data point for the selected day and time
              if (activeMenu == "custom") {
                // Check if responsedata is available and not empty
                if (!customviewerdata || customviewerdata.length === 0) {
                  // return if no value is found form the backend
                  return;
                }
                const dataIdx =
                  1 * (selectedDayForCustomData - 1) +
                  23 * (selectedDayForCustomData - 1) +
                  newIndex;
                // console.log(dataIdx);
                const dataPoint_Custom = customviewerdata[dataIdx];
                console.log("\n\n the data point custom ", dataPoint_Custom);
                // checking if data point is empty or not
                if (dataPoint_Custom) {
                  // Assuming dataPoint = [predictedValue, date, time, [x, y, z]]
                  const angleVector = dataPoint_Custom[3]; // [x, y, z] angles
                  setPredictedvalue(()=> dataPoint_Custom[0]);
                  console.log("\n\n the predic", dataPoint_Custom[0]);
                  setrotationcube(angleVector);
                } else {
                  // Show toast bar if no dataPoint found
                  console.log("no data found");
                  setrotationcube([0, 0, 0]);
                }
              } else if (activeMenu == "time" || activeMenu == "upload") {
                // Check if responsedata is available and not empty
                if (!responsedata || responsedata.length === 0) {
                  // return if no value is found form the backend
                  return;
                }
                const dataIdx =
                  1 * (seletectedday - 1) + 23 * (seletectedday - 1) + newIndex;
                const dataPoint = responsedata[dataIdx];
                // console.log("\n\n the data point time file ", dataPoint);
                // setdataPoint(responsedata[dataIdx]);
                if (dataPoint) {
                  // Assuming dataPoint = [date, time, [x, y, z]]
                  // If your data structure is different, adjust accordingly
                  const angleVector = dataPoint[2]; // [x, y, z] angles
                  setrotationcube(angleVector);
                } else {
                  // Show toast bar if no dataPoint found
                  setrotationcube([0, 0, 0]);
                }
              }
            }}
            className="time-slider"
          />
          <div className="slider-markers">
            {timeArray.map((label, idx) => (
              <span
                key={idx}
                className="slider-marker"
                style={{ left: `${(idx / (timeArray.length - 1)) * 100}%` }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="app-container">
        {sidebarOpen && (
          <Sidebar className="sidebar" style={{ width: "30vw" }}>
            <Menu className="menu_sidebar">
              <MenuItem
                className={`pro-menu-item${
                  activeMenu === "upload" ? " active" : ""
                }`}
                onClick={() => setActiveMenu("upload")}>
                <span className="menu-icon">📁</span>
                File Upload
              </MenuItem>
              <MenuItem
                className={`pro-menu-item${
                  activeMenu === "time" ? " active" : ""
                }`}
                onClick={() => setActiveMenu("time")}>
                <span className="menu-icon">⏳</span>
                Time Slider
              </MenuItem>
              <MenuItem
                className={`pro-menu-item${
                  activeMenu === "custom" ? " active" : ""
                }`}
                onClick={() => setActiveMenu("custom")}>
                <span className="menu-icon">⚙️</span>
                Custom Data Viewer
              </MenuItem>
            </Menu>
            {/* file upload box */}
            <div className="sidebar-content">
              {activeMenu === "upload" && (
                <div className="uploader-box">
                  <div className="content-header">Upload CSV File</div>
                  <form>
                    <input
                      type="file"
                      id="csv-upload"
                      accept=".csv"
                      multiple={false}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (
                          file &&
                          file.type !== "text/csv" &&
                          !file.name.endsWith(".csv")
                        ) {
                          alert("Please select a CSV file.");
                          e.target.value = "";
                          setSelectedFile(null);
                        } else {
                          setSelectedFile(file);
                          console.log(file);
                        }
                      }}
                    />
                    <button
                      className="load-btn"
                      disabled={!selectedFile}
                      onClick={async (e) => {
                        e.preventDefault();
                        setSidebarOpen(false);
                        setShowTimeSlider(true);
                        // Handle file load logic here
                        // Use FormData to upload the file properly
                        const formData = new FormData();
                        formData.append("file", selectedFile);
                        try {
                          const response = await axios.post(
                            "/fileUpload",
                            formData,
                            {
                              headers: {
                                "Content-Type": "multipart/form-data",
                              },
                            }
                          );
                          console.log("the data is there", response);
                          setreponsedata(response.data?.angle_time_date_array);
                          console.log(response.data?.angle_time_date_array);
                        } catch (error) {
                          console.error("File upload failed:", error);
                        }
                      }}>
                      Load
                    </button>
                  </form>
                </div>
              )}
              {/* weekly dropped file */}
              {activeMenu === "time" ? (
                selectedFile ? (
                  <div className="time-slider-box">
                    <div className="content-header">Time Slider</div>
                    <TimeSlider
                      seletectedday={seletectedday}
                      setseletectedday={setseletectedday}
                      // data={responsedata.slice((1 * (seletectedday - 1)+24*(seletectedday-1)), 24*seletectedday)}
                      startDate={
                        responsedata && responsedata[0] && responsedata[0][0]
                          ? responsedata[0][0]
                          : "XX:XX:XXXX"
                      }
                      endDate={
                        responsedata &&
                        responsedata[167] &&
                        responsedata[167][0]
                          ? responsedata[167][0]
                          : "XX:XX:XXXX"
                      }
                      // endDate={responsedata && (responsedata[167][0] && "XX:XX:XXXX")}
                    />
                  </div>
                ) : (
                  <div className="time-slider-box">
                    <div className="content-header">Time Slider</div>
                    <p>No file given</p>
                  </div>
                )
              ) : null}

              {/* global dropped file in the system  */}
              {activeMenu === "custom" && (
                <div className="customization-box">
                  <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    Predicted Value:{" "}
                    {Predictedvalue == null ? "N/A" : Predictedvalue ? "True" : "False"}
                  </h3>
                  <CustomDataViewer
                    rotation={rotationcube}
                    setrotation={setrotationcube}
                    responsedata={customviewerdata}
                    setresponsedata={setcustomviewerdata}
                    selectedDayForCustomData={selectedDayForCustomData}
                    setselectedDayForCustomData={setSelectedDayForCustomData}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    Predictedvalue={Predictedvalue}
                  />
                </div>
              )}
            </div>
          </Sidebar>
        )}
        <Canvas
          style={{ height: "100vh", width: "100%", backgroundColor: "black" }}
          camera={{ position: [0, 3, 5], fov: 75 }}>
          <Earth />
          <LEOOrbit />
          <Satellite
            rotationcube={rotationcube}
            setrotationcube={setrotationcube}
          />
          <OrbitControls enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
    </div>
  );
}
