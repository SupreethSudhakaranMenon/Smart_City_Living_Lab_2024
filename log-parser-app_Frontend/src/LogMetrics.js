import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LogMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/log_metrics')
      .then((response) => {
        setMetrics(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading metrics...</div>;
  }

  if (error) {
    return <div>Error loading metrics: {error.message}</div>;
  }

  return (
    <div>
      <h2>Log Metrics</h2>
      <p>Total Requests: {metrics.total_requests}</p>
      <p>Average Access Time: {metrics.avg_access_time}</p>
      <h3>Request Counts:</h3>
      <ul>
        {Object.entries(metrics.request_counts).map(([method, count]) => (
          <li key={method}>{method}: {count}</li>
        ))}
      </ul>
      <h3>Response Codes:</h3>
      <ul>
        {Object.entries(metrics.response_codes).map(([code, count]) => (
          <li key={code}>{code}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default LogMetrics;
