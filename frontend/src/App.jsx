import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Earth from "./components/Earth";
import LEOOrbit from "./components/LEO";
import Satellite from "./components/Sat";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useDropzone } from 'react-dropzone';
import Dropzone from "react-dropzone";
import { Camera } from "three";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTimeSlider, setShowTimeSlider] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);

  // Example time array (replace with your own)
  const timeArray = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00"];

  return (
    <div>
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((open) => !open)}
        style={{ zIndex: 200 }}
      >
        {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>
      {showTimeSlider && (
        <div className="time-slider-container">
          <input
            type="range"
            min={0}
            max={timeArray.length - 1}
            value={currentTimeIndex}
            onChange={e => setCurrentTimeIndex(Number(e.target.value))}
            className="time-slider"
          />
          <div className="slider-markers">
            {timeArray.map((label, idx) => (
              <span
                key={idx}
                className="slider-marker"
                style={{ left: `${(idx / (timeArray.length - 1)) * 100}%` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="app-container">
        {sidebarOpen && (
          <Sidebar className="sidebar">
            <Menu className="menu_sidebar">
              <MenuItem
                className={`pro-menu-item${activeMenu === "upload" ? " active" : ""}`}
                onClick={() => setActiveMenu("upload")}
              >
                <span className="menu-icon">📁</span>
                File Upload
              </MenuItem>
              <MenuItem
                className={`pro-menu-item${activeMenu === "time" ? " active" : ""}`}
                onClick={() => setActiveMenu("time")}
              >
                <span className="menu-icon">⏳</span>
                Time Slider
              </MenuItem>
              <MenuItem
                className={`pro-menu-item${activeMenu === "custom" ? " active" : ""}`}
                onClick={() => setActiveMenu("custom")}
              >
                <span className="menu-icon">⚙️</span>
                Customization
              </MenuItem>
            </Menu>
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
                        if (file && file.type !== "text/csv" && !file.name.endsWith(".csv")) {
                          alert("Please select a CSV file.");
                          e.target.value = "";
                          setSelectedFile(null);
                        } else {
                          setSelectedFile(file);
                        }
                      }}
                    />
                    <button
                      className="load-btn"
                      disabled={!selectedFile}
                      onClick={e => {
                        e.preventDefault();
                        setSidebarOpen(false);
                        setShowTimeSlider(true);
                        // Handle file load logic here
                        alert(`Loading file: ${selectedFile?.name}`);
                      }}
                    >
                      Load
                    </button>
                  </form>
                </div>
              )}
              {activeMenu === "time" && (
                <div className="time-slider-box">
                  <div className="content-header">Time Slider</div>
                  <p>Time Slider goes here</p>
                </div>
              )}
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
          camera={{ position: [0, 3, 5], fov: 75 }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[5, 3, 5]} intensity={1} />
          <Earth />
          <LEOOrbit />
          <Satellite />
          <OrbitControls enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
    </div>
  );
}
