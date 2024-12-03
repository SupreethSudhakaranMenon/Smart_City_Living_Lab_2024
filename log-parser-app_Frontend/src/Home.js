import React from 'react';
import ProcessLogs from './ProcessLogs'; // Import the ProcessLogs component

function Home() {
  return (
    <div>
      <h2>Welcome to the Log Parser API</h2>
      <p>Select an endpoint from the menu to interact with the backend.</p>
      
      <ProcessLogs />  {/* Add the button to trigger log processing */}
    </div>
  );
}

export default Home;
