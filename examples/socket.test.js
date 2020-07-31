const io = require('socket.io-client');

const socket = io.connect('ws://localhost:3000');

socket.on('session.created', (data) => {
  console.log('Session Created', data);
});
socket.on('session.joined', (data) => {
  console.log('Client Joined', data);
});
socket.on('session.left', (data) => {
  console.log('Client Left', data);
});
socket.on('session.ended', (data) => {
  console.log('Session Ended', data);
});
socket.on('connect', () => {
  console.log('connected!');
  socket.emit('request', {
    event: 'session.list',
    data: {},
  }, (result) => {
    console.log('Sessions', result);
    if (result.length > 0) {
      socket.emit('request', {
        event: 'session.join',
        data: {
          name: 'Test Session',
        },
      }, (result) => {
        console.log('Session Joined!', result);
      });
    } else {

      socket.emit('request', {
        event: 'session.host',
        data: {
          name: 'Test Session',
        },
      }, (result) => {
        console.log('Session Creation', result);
      });
    }
  });
});
