# Satellite Visualizer

A simple Flask backend for visualizing satellite data.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/satellite_visualizer.git
   cd satellite_visualizer
   ```

2. **(Recommended) Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install the package and dependencies:**
   ```bash
   pip install .
   ```

## Running the App

You can run the Flask app in two ways:

### 1. Using the CLI command

After installation, run:
```bash
run-myapp
```

### 2. Using Python module

Alternatively, you can run:
```bash
python -m satellite_visualizer
```

The app will start on the default Flask port (usually http://127.0.0.1:5000).

## Development

If you want to make changes and test locally:
```bash
pip install -e .
```
This will install the package in "editable" mode.

## Notes

- The frontend (React app) is not included in this package. See the `frontend/` directory for details.
- Make sure you have Python 3.7+ installed.