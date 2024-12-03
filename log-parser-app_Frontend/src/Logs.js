import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/logs_tables.css'; // Assuming you style the table in a separate CSS file.

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch logs from the backend API
    axios.get('http://127.0.0.1:5000/api/logs')
      .then((response) => {
        console.log(response.data); // Debugging: view response structure
        if (response.data.logs) {
          setLogs(response.data.logs);
        } else {
          setError('No logs available');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error loading logs: ${err.message}`);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading logs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="logs-container">
      <h2>Parsed Logs</h2>

      {/* Conditional rendering if no logs are available */}
      {logs.length === 0 ? (
        <p>No logs available</p>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>IP</th>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Details</th>
              <th>Event</th>
              <th>IoT Device Image</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.ip}</td>
                <td>{log.timestamp}</td>
                <td>{log.action || "N/A"}</td>
                <td>{log.details || "N/A"}</td>
                <td>{log.event || "N/A"}</td>
                <td>
                  {log.iot_device_image ? (
                    <img
                      src={log.iot_device_image}
                      alt="IoT Device"
                      className="iot-device-image"
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{log.user || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Logs;
