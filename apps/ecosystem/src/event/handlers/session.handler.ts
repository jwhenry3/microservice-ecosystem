import { Server, Socket } from 'socket.io';

export class SessionHandler {

  constructor(private server: Server) {

  }

  handleRequestBehavior(client: Socket, payload: { event: string, data: any }, response: any) {
    if (payload.event === 'map.join' && response?.map) {
      client.join(response.map);
    }
    if (payload.event === 'map.leave' && response?.map) {
      client.leave(response.map);
    }
    if (payload.event === 'session.join' && response.status === 'success') {
      client.join(payload.data.name);
    }
    if (payload.event === 'session.leave' && response.status === 'success') {
      client.leave(payload.data.name);
    }
    if (payload.event === 'session.host' && response.status === 'success') {
      client.join(payload.data.name);
    }
  }

  handleEmitBehavior(payload: { event: string, data: any }) {
    if (payload.event === 'session.ended') {
      this.server.in(payload.data.session).clients((error, ids) => {
        if (error) {
          console.warn(error);
          return;
        }
        // By the time the socket is reached to leave, the client may have already left
        // or they were the host and it doubled up on the leave. This is not a bug, we just need to let
        // the socket not exist in the namespace
        ids.forEach(id => {
          this.server.sockets.sockets[id].leave(payload.data.session);
        });
      });
    }
  }
}
