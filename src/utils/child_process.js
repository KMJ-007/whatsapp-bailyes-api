import axios from 'axios';

process.stdin.setEncoding('utf8');

process.stdin.on('data', async (data) => {
    const requestData = JSON.parse(data);

    try {
        const response = await axios(requestData);
        console.log(response.data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
});
