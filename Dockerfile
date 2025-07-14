# --- Stage 1: Build React frontend ---
FROM node:20 AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Set up Python/Flask backend ---
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies
COPY req.txt .
RUN pip install --no-cache-dir -r req.txt

# Copy backend code
COPY backend/ backend/
COPY routes/ routes/
COPY utils/ utils/
COPY backend/main.py .

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port (Flask default is 5000)
EXPOSE 5000

# Run Flask app
CMD ["python", "backend/main.py"]

