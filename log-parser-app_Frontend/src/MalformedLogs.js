import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MalformedLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/malformed')
      .then((response) => {
        setLogs(response.data.malformed_logs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading malformed logs...</div>;
  }

  if (error) {
    return <div>Error loading malformed logs: {error.message}</div>;
  }

  return (
    <div>
      <h2>Malformed Logs</h2>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
};

export default MalformedLogs;
