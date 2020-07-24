const io = require('socket.io-client');

const socket = io.connect('ws://localhost:3000');

socket.on('test', (data) => {
  console.log('Test Side Effect Received', data);
});
socket.on('connect', () => {
  console.log('connected!');
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
