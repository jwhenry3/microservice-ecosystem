const io = require('socket.io-client');

const socket = io.connect('ws://localhost:3000');

socket.on('connect', () => {
  console.log('connected!');
  socket.on('test', (data) => {
    console.log('Test Received', data);
  });
  socket.emit('emit', {
    event: 'test',
    data: { test: 'value' },
  });
  socket.emit('request', {
    event: 'test',
    data: { test: 'value' },
  }, (result) => {
    console.log('Test Response Received', result);
  });
});
