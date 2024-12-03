import React from 'react';
import axios from 'axios';

const ProcessLogs = () => {
  const handleProcessLogs = () => {
    axios.post('http://localhost:5000/api/process_logs')
      .then(response => {
        alert('Log processing started');
      })
      .catch(error => {
        alert('Error processing logs: ' + error.message);
      });
  };

  return <button onClick={handleProcessLogs}>Process Logs</button>;
};

const LogProcessing = () => {
  return (
    <div>
      <h2>Log Processing</h2>
      <p>Click the button below to start processing the logs:</p>
      <ProcessLogs />
    </div>
  );
};

export default LogProcessing;
