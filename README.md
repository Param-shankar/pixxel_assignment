# Pixxel Attitude Visualizer

This repository contains a full-stack application for visualizing satellite attitude data based on quaternion inputs from CSV files, as per the Pixxel assignment specifications. The app features a React frontend for interactive visualization and a Flask backend for data handling and API services. It's fully dockerized for easy deployment and runs "out of the box" on any machine with Docker installed.

The setup uses React for the user interface (including a time slider and attitude animation) and Flask for backend logic like CSV parsing, data storage, retrieval, and stitching across multiple files. Bonuses like additional data visualizations are included.

## Features

- **Attitude Visualizer**: Interactive 3D animation of satellite orientation using quaternions (Q0-Q3) and timestamps from CSV inputs.
- **Data Storage and Retrieval**: Handles storage of processed data and retrieval across multiple CSV files, managing overlaps efficiently.
- **Time Slider**: Allows users to scrub through timestamps for dynamic visualization.
- **Modular Design**: Clear separation of frontend and backend, with API endpoints for seamless integration.
- **Docker Support**: Packaged as a Docker image for one-command setup and portability.

## Prerequisites

- Docker (for the easiest setup).
- Alternatively, Python 3.11+ and Node.js 16+ for local installation.
- Git for cloning the repository.
# Pixxel Attitude Visualizer

This repository contains a full-stack application for visualizing satellite attitude data based on quaternion inputs from CSV files, as per the Pixxel assignment specifications. The app features a React frontend for interactive visualization and a Flask backend for data handling and API services. It's fully dockerized for easy deployment and runs "out of the box" on any machine with Docker installed.

The setup uses React for the user interface (including a time slider and attitude animation) and Flask for backend logic like CSV parsing, data storage, retrieval, and stitching across multiple files. Bonuses like additional data visualizations are included.

## Features

- **Attitude Visualizer**: Interactive 3D animation of satellite orientation using quaternions (Q0-Q3) and timestamps from CSV inputs.
- **Data Storage and Retrieval**: Handles storage of processed data and retrieval across multiple CSV files, managing overlaps efficiently.
- **Time Slider**: Allows users to scrub through timestamps for dynamic visualization.
- **Modular Design**: Clear separation of frontend and backend, with API endpoints for seamless integration.
- **Docker Support**: Packaged as a Docker image for one-command setup and portability.

## Prerequisites

- Docker (for the easiest setup).
- Alternatively, Python 3.11+ and Node.js 16+ for local installation.
- Git for cloning the repository.

## Installation

### Option 1: Using Docker (Recommended)
Since you have the Docker image ready, this is the simplest way to get started. The image bundles the React build served directly by Flask.

1. Pull or build the Docker image:
   - If you have the image locally: Skip to running it.
   - To build from source: Clone the repo and run `docker build -t pixxel_assignment .` in the project root.
   - If you don't have local image you can use docker hub to pull
   - - To build from source: Clone the repo and run `docker pull paramshankar/pixxel_assignment ` in the project root.

2. Run the container:
   ```
   docker run -p 5000:5000 pixxel_assignemnt
   ```
   - This exposes the app on port 5000.

3. Access the app: Open `http://localhost:5000` in your browser.

### Option 2: Local Installation (Without Docker)
For development or if Docker isn't an option:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pixxel_assignment.git
   cd pixxel_assignment 
   ```

2. Set up the backend (Flask):
   - Navigate to `/backend`.
   - Create a virtual environment: `python -m venv venv` and activate it.
   - Install dependencies: `pip install -r requirements.txt`.
   
3. Set up the frontend (React):
   - Navigate to `/frontend`.
   - Install dependencies: `npm install`.
   - Build the app: `npm run build` (this generates the `dist` folder).

4. Serve from Flask:
   - configure paths accordingly (as provied in the backend/main.py ).
   - Run the Flask app: `python main.py` 

5. Access the app: Visit `http://localhost:5000`.

## Usage

1. **Launch the App**: Follow the installation steps above.
2. **Upload CSVs**: Use the interface to upload CSV files containing quaternion data (columns: timestamp, Q0, Q1, Q2, Q3).
3. **Visualize Attitude**:
   - The 3D visualizer will render the satellite's orientation.
   - Use the time slider to navigate through timestamps.
   - Data from multiple files is automatically stitched, handling overlaps.
4. **Retrieve Data**: Query stored data via the UI 


For detailed usage, refer to the `/docs` folder or inline comments in the code.

## Project Structure

```
pixxel-attitude-visualizer/
├── backend/             # Flask backend code
│   ├── main.py           # Main entry point (or main.py)
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions (e.g., quaternion processing)
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend code
│   ├── src/             # React components and logic
│   ├── public/          # Static assets
│   └── package.json     # Node dependencies
├── docs/                # Documentation (e.g., architecture.md)
├── Dockerfile           # For building the Docker image
└── README.md            # This file
```

## Development and Contributing

- **Contributions**: Fork the repo, create a branch, and submit a pull request. Focus on modularity and readability as per assignment guidelines.

