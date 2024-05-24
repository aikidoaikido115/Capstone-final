const fs = require('fs');

// Create a readable stream from a file
const stream = fs.createReadStream('./controllers/example.txt');

// Listen for data events emitted by the stream
stream.on('data', (chunk) => {
    console.log('Received chunk:', chunk);
});

// Listen for the end event emitted when the stream ends
stream.on('end', () => {
    console.log('Stream ended');
});

// Listen for errors that occur during reading
stream.on('error', (error) => {
    console.error('Error:', error.message);
});