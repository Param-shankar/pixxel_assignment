import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Earth from "./components/Earth";
import LEOOrbit from "./components/LEO";
import Satellite from "./components/Sat";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";
import { Camera } from "three";
import axios from "axios";
import TimeSlider from "./components/TimeSlider";
import { Bounce, ToastContainer, toast } from "react-toastify";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTimeSlider, setShowTimeSlider] = useState(true);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  // Example time array (replace with your own)
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
  //initilly at 0,0,0
  const [rotationcube, setrotationcube] = useState([0, 0, 0]);
  const [seletectedday, setseletectedday] = useState(1);
  //[[date, time , [x,y,z]]]
  const [responsedata, setreponsedata] = useState([]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
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
              const newIndex = Number(e.target.value);
              setCurrentTimeIndex(newIndex);

              // Check if responsedata is available and not empty
              if (!responsedata || responsedata.length === 0) {
                // Show toast bar if no file/data is present
                toast.warn(
                  "Please upload the csv file to see the weekly data",
                  {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                  }
                );
                setrotationcube([0, 0, 0]);
                return;
              }

              // Get the data point for the selected day and time
              const dataIdx =
                1 * (seletectedday - 1) + 23 * (seletectedday - 1) + newIndex;
              const dataPoint = responsedata[dataIdx];

              if (dataPoint) {
                // Assuming dataPoint = [date, time, [x, y, z]]
                // If your data structure is different, adjust accordingly
                const angleVector = dataPoint[2]; // [x, y, z] angles
                setrotationcube(angleVector);
              } else {
                // Show toast bar if no dataPoint found
                toast.warn(
                  "Please upload the csv file to see the weekly data",
                  {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                  }
                );

                setrotationcube([0, 0, 0]);
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
                Customization
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
                  <div className="content-header">Customization</div>
                  <p>Customization options go here</p>
                </div>
              )}
            </div>
          </Sidebar>
        )}
        <Canvas
          style={{ height: "100vh", width: "100%", backgroundColor: "black" }}
          camera={{ position: [0, 3, 5], fov: 75 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 3, 5]} intensity={1} />
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
