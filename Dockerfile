# --------------------------
# Stage 1: Build Frontend
# --------------------------
FROM node:20 AS frontend-builder

# Set working directory
WORKDIR /app/frontend

# Copy frontend code
COPY diabetes-predictor-app/diabetes-predictor-frontend/package*.json ./
COPY diabetes-predictor-app/diabetes-predictor-frontend/ ./

# Install frontend dependencies and build
RUN npm install
RUN npm run build

# --------------------------
# Stage 2: Setup Backend
# --------------------------
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y curl build-essential

# Install Node.js (needed if you want to serve frontend via backend)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

# Set working directory
WORKDIR /app/backend

# Copy backend code
COPY diabetes-predictor-app/backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ../diabetes-predictor-frontend/dist

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port (Railway provides $PORT)
ENV PORT 8000

# Start FastAPI server, serving frontend
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
