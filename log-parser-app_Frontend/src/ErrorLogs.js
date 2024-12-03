import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ErrorLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/errors')
      .then((response) => {
        setLogs(response.data.error_logs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading error logs...</div>;
  }

  if (error) {
    return <div>Error loading error logs: {error.message}</div>;
  }

  return (
    <div>
      <h2>Error Logs</h2>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
};

export default ErrorLogs;
