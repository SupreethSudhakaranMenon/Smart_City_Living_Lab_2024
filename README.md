
# IoT-Log-Parser-Software

This repository contains the IoT-Log-Parser-Software, a tool designed for parsing, analyzing, and visualizing IoT device logs. The software supports Base64 image decoding, web server log parsing, and generating structured data for analysis, accompanied by a user-friendly frontend interface.

---

## Table of Contents
- [Introduction](#introduction)
- [Setup and Installation](#setup-and-installation)
- [How to Run](#how-to-run)
- [Features](#features)
- [Screenshots](#screenshots)
- [Assumptions](#assumptions)
- [Performance Analysis](#performance-analysis)
- [Future Improvements](#future-improvements)

---

## Introduction

The IoT-Log-Parser-Software is built for Smart City applications where large-scale sensor and device logs require processing and visualization. It can:
- Parse logs for structured data.
- Decode Base64 images for visualization.
- Extract key metrics from web server logs.
- Provide a dashboard to explore parsed data and images.

---

## Setup and Installation

### Backend
1. Install Python 3.8+.
2. Run the backend server:
   ```bash
   python3 Log_Parser_Classes_Backend(main).py
   ```

### Frontend
1. Install Node.js (version 16+ recommended).
2. Navigate to the `log-parser-app_Frontend` directory.
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm start
   ```

---

## How to Run

1. Start the backend service:
   ```bash
   python3 Log_Parser_Classes_Backend(main).py
   ```
2. Launch the frontend by navigating to `log-parser-app_Frontend` and running:
   ```bash
   npm start
   ```
3. Open the application in your browser (default: `http://localhost:3000`) to access the dashboard.

Command-line parameters for the backend can be configured as shown below:

![Backend Parameters](https://github.com/user-attachments/assets/3951d322-5fa2-442a-b37b-b6e3706a6a39)

---

## Features

### Backend
The backend provides APIs for:
- `GET /api/logs`: Fetch parsed log data.
- `GET /api/images`: List paginated decoded images.
- `GET /api/images/<filename>`: Fetch a specific image.
- `GET /api/malformed`: Retrieve malformed log entries.
- `GET /api/errors`: Retrieve error log entries.
- `POST /api/process_logs`: Trigger log processing.
- `GET /api/log_metrics`: Fetch log metrics like request counts, response codes, and access times.

### File System Outputs
- **Decoded Images**: Stored in the `decoded_images` folder.
- **Parsed Logs**: Output as `parsed_logs.csv` for further analysis.

### Dashboard
The dashboard visualizes:
- Decoded images from logs.
- Metrics extracted from web server logs.

---

## Screenshots

### Backend File Outputs
![File Outputs](https://github.com/user-attachments/assets/66847614-7226-443a-a154-c20966dfab96)

### Dashboard Interface
![Dashboard UI](https://github.com/user-attachments/assets/91cbad75-baf4-43dd-8ee2-535896c264b6)

---

## Assumptions

- Log files contain well-structured key-value pairs.
- Base64 encoded images in logs are valid and can be decoded without errors.
- Web server logs follow standard formats (e.g., Apache or Nginx).

---

## Performance Analysis

- **Small Logs**: Processes in 2-3 seconds.
- **Medium Logs**: Parses within 10 seconds.
- **Large Logs**: May take up to 30 seconds depending on the log size and system resources.

---

## Future Improvements

- Resolve CORS issues for seamless frontend-backend integration.
- Add advanced filtering and sorting capabilities to the dashboard.
- Optimize backend performance for high-volume data.
- Preview of Logs in the Dashboard
- Implementing Pagination currently supports first 100 images. 

---

This software is a stepping stone towards efficient IoT log analysis and visualization for Smart City solutions. Contributions are welcome!
