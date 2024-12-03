import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LogMetrics from './LogMetrics';
import Logs from './Logs';
import Images from './Images';
import MalformedLogs from './MalformedLogs';
import ErrorLogs from './ErrorLogs';
import LogProcessing from './LogProcessing';  // Import LogProcessing component

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Log Parser API</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/logs">Parsed Logs</Link></li>
            <li><Link to="/images">Decoded Images</Link></li>
            <li><Link to="/malformed">Malformed Logs</Link></li>
            <li><Link to="/errors">Error Logs</Link></li>
            <li><Link to="/log-metrics">Log Metrics</Link></li>
            <li><Link to="/log-processing">Log Processing</Link></li>  {/* Add link to Log Processing */}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/images" element={<Images />} />
          <Route path="/malformed" element={<MalformedLogs />} />
          <Route path="/errors" element={<ErrorLogs />} />
          <Route path="/log-metrics" element={<LogMetrics />} />
          <Route path="/log-processing" element={<LogProcessing />} />  {/* Add route */}
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Welcome to the Log Parser API</h2>
      <p>Select an endpoint from the menu to interact with the backend.</p>
    </div>
  );
}

export default App;
