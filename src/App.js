// @flow
import React, { useState } from 'react';

import Grid from './components/Grid';
import './App.css';

function App() {
    const [isRunning, setIsRunning] = useState(false);

    return (
        <div className="app-container">
            <div style={{ margin: '20px auto'}}>
                <button
                    onClick={() => {
                        setIsRunning(!isRunning)
                    }}
                >
                    {isRunning ? 'Pause' : 'Run'}
                </button>
            </div>
            <Grid isRunning={isRunning} />
        </div>
    );
}

export default App;
