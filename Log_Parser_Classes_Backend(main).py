from flask import Flask, jsonify, send_file, request
import os
import pandas as pd
import logging
from flask_cors import CORS
import re
from collections import Counter

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:4000", "http://localhost:8501"]}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths
PARSED_CSV_PATH = '/Users/supreethskaran/SmartCity/parsed_logs.csv'
LOG_FILE_PATH = '/Users/supreethskaran/Desktop/assignment_prod.log'
IMAGE_FOLDER = "decoded_images"

# Utility: Ensure image folder exists
os.makedirs(IMAGE_FOLDER, exist_ok=True)

# Global storage
malformed_logs = []
error_logs = []
parsed_df = pd.DataFrame()

# Regular expressions for log parsing
LOG_PATTERN = r'(?P<ip>\S+) \S+ \S+ \[(?P<timestamp>.*?)\] "(?P<method>\S+) (?P<url>\S+) \S+" (?P<response_code>\d+) \S+ "(?P<referrer>.*?)" "(?P<user_agent>.*?)"'

# Utility function to parse logs and extract metrics
def parse_log_metrics(log_lines):
    request_count = Counter()
    response_codes = Counter()
    access_times = []

    for line in log_lines:
        match = re.match(LOG_PATTERN, line)
        if match:
            method = match.group("method")
            response_code = match.group("response_code")
            timestamp = match.group("timestamp")

            # Count request methods
            request_count[method] += 1
            # Count response codes
            response_codes[response_code] += 1
            # Convert timestamp to access time (if it's in a format we can parse)
            try:
                access_times.append(pd.to_datetime(timestamp, format="%d/%b/%Y:%H:%M:%S %z"))
            except Exception as e:
                logger.warning(f"Could not parse timestamp: {timestamp}")
    
    # Calculate metrics
    total_requests = sum(request_count.values())
    avg_access_time = pd.to_datetime(access_times).mean() if access_times else None
    return request_count, response_codes, total_requests, avg_access_time

@app.route('/')
def index():
    return jsonify({
        "message": "Welcome to the Log Parser API",
        "endpoints": {
            "GET /api/logs": "Fetch parsed log data",
            "GET /api/images": "List paginated decoded images",
            "GET /api/images/<filename>": "Fetch a specific image",
            "GET /api/malformed": "Retrieve malformed log entries",
            "GET /api/errors": "Retrieve error log entries",
            "POST /api/process_logs": "Trigger log processing",
            "GET /api/log_metrics": "Fetch extracted log metrics (request counts, response codes, access times)"
        }
    })

# Endpoint: Fetch parsed logs as JSON
@app.route('/api/logs', methods=['GET'])
def get_logs():
    try:
        if not os.path.exists(PARSED_CSV_PATH):
            return jsonify({"error": "Parsed logs not available"}), 404
        
        # Read the CSV into a DataFrame
        df = pd.read_csv(PARSED_CSV_PATH)
        
        # Check if the DataFrame is empty
        if df.empty:
            return jsonify({"message": "No logs available"}), 200

        # Convert the DataFrame to a list of dictionaries (records)
        logs = df.to_dict(orient='records')

        # Return the logs wrapped in an object for frontend
        return jsonify({
            "logs": logs,
            "total": len(logs)
        }), 200

    except Exception as e:
        logger.error(f"Error fetching logs: {e}")
        return jsonify({"error": str(e)}), 500


# Endpoint: Fetch log metrics
@app.route('/api/log_metrics', methods=['GET'])
def get_log_metrics():
    try:
        if not os.path.exists(LOG_FILE_PATH):
            return jsonify({"error": f"Log file not found: {LOG_FILE_PATH}"}), 404

        # Read log lines
        with open(LOG_FILE_PATH, 'r') as file:
            log_lines = file.readlines()

        # Extract metrics
        request_count, response_codes, total_requests, avg_access_time = parse_log_metrics(log_lines)

        return jsonify({
            "request_counts": request_count,
            "response_codes": response_codes,
            "total_requests": total_requests,
            "avg_access_time": avg_access_time.isoformat() if avg_access_time else None
        })
    except Exception as e:
        logger.error(f"Error fetching log metrics: {e}")
        return jsonify({"error": str(e)}), 500

# Endpoint: Fetch paginated list of decoded images
@app.route('/api/images', methods=['GET'])
def get_images():
    try:
        start_index = int(request.args.get("startIndex", 0))
        end_index = int(request.args.get("endIndex", 100))

        image_files = [
            f for f in os.listdir(IMAGE_FOLDER) if f.endswith(".png")
        ]
        total_images = len(image_files)
        paginated_images = image_files[start_index:end_index]

        return jsonify({
            "images": paginated_images,
            "total_images": total_images,
            "startIndex": start_index,
            "endIndex": end_index
        })
    except Exception as e:
        logger.error(f"Error fetching images: {e}")
        return jsonify({"error": str(e)}), 500

# Endpoint: Fetch specific image
@app.route('/api/images/<filename>', methods=['GET'])
def get_image(filename):
    try:
        image_path = os.path.join(IMAGE_FOLDER, filename)
        if os.path.exists(image_path):
            return send_file(image_path, mimetype='image/png')
        else:
            return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        logger.error(f"Error fetching image {filename}: {e}")
        return jsonify({"error": str(e)}), 500

# Endpoint: Fetch malformed logs
@app.route('/api/malformed', methods=['GET'])
def get_malformed_logs():
    return jsonify({"malformed_logs": malformed_logs})

# Endpoint: Fetch error logs
@app.route('/api/errors', methods=['GET'])
def get_error_logs():
    return jsonify({"error_logs": error_logs})

# Endpoint: Process logs and populate endpoints
@app.route('/api/process_logs', methods=['POST'])
def process_logs():
    try:
        global parsed_df, malformed_logs, error_logs

        if not os.path.exists(LOG_FILE_PATH):
            return jsonify({"error": f"Log file not found: {LOG_FILE_PATH}"}), 404

        # Read log lines
        with open(LOG_FILE_PATH, 'r') as file:
            log_lines = file.readlines()
        logger.info("Log file loaded successfully.")

        # Initialize LogParser and process logs
        log_parser = LogParser(log_lines)
        log_parser.parse_logs()
        parsed_df, malformed_logs, error_logs, saved_images = log_parser.get_results()

        # Save parsed data to CSV
        parsed_df.to_csv(PARSED_CSV_PATH, index=False)
        logger.info("Parsed data saved to CSV.")
        
        return jsonify({"message": "Logs processed successfully"}), 200
    except Exception as e:
        logger.error(f"Error processing logs: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
