import { spawn } from 'child_process';
import axios from 'axios';
import { messageDataType } from '../types';

export const sendDataSAbackend = async (messageData: messageDataType) => {
    const apiUrl = 'YOUR_BACKEND_ENDPOINT_URL';

    const body = {
        method: 'post',
        url: apiUrl,
        data: messageData,
        headers: { 'Content-Type': 'application/json' } // Assuming JSON data
    };

    const child = spawn('node', ['child_process.js'], { stdio: 'inherit' }); // Spawning child process

    child.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
    });

    child.on('error', (err) => {
        console.error('Failed to start subprocess.', err);
    });

    child?.stdin?.write(JSON.stringify(body)); // Sending data to child process
    child?.stdin?.end();
};
