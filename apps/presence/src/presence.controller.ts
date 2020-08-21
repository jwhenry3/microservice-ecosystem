import { Controller, Get }             from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

export interface Session {
  host: string
  name: string
  clients: string[]
}

@Controller()
export class PresenceController {
  sessions: { [name: string]: Session } = {};

  constructor(private client: ClientProxy) {
  }

  @MessagePattern('request.session.list')
  onList() {
    return Object.keys(this.sessions).map(name => this.sessions[name]);
  }

  @MessagePattern('request.session.host')
  onHost(data: { data: { name: string }, requesterId: string }) {
    const name = data.data.name;
    if (this.sessions[name]) {
      return { status: 'error', reason: 'not unique' };
    }
    this.sessions[name] = {
      host   : data.requesterId,
      name   : name,
      clients: [],
    };
    this.client.emit('emit.broadcast', { event: 'session.created', data: this.sessions[name] });
    return { status: 'success' };
  }

  @MessagePattern('request.session.join')
  onJoin(data: { data: { name: string }, requesterId: string }) {
    const name = data.data.name;
    if (!this.sessions[name]) {
      return { status: 'error', reason: 'not found' };
    }
    if (this.sessions[name].host === data.requesterId) {
      return { status: 'error', reason: 'is host' };
    }
    if (this.sessions[name].clients.includes(data.requesterId)) {
      return { status: 'error', reason: 'in session' };
    }
    this.sessions[name].clients.push(data.requesterId);
    this.client.emit('emit.to', { event: 'session.joined', id: name, data: { client: data.requesterId } });
    return { status: 'success' };
  }

  @MessagePattern('request.session.leave')
  onLeave(data: { data: { name: string }, requesterId: string }) {
    const name = data.data.name;
    if (!this.sessions[name]) {
      return { status: 'error', reason: 'not found' };
    }
    if (this.sessions[name].host !== data.requesterId && !this.sessions[name].clients.includes(data.requesterId)) {
      return { status: 'error', reason: 'not in session' };
    }
    if (this.sessions[name].host === data.requesterId) {
      this.client.emit('emit.to', { event: 'session.ended', id: name, data: { session: name } });
      delete this.sessions[name];
      return { status: 'success' };
    }
    this.sessions[name].clients = this.sessions[name].clients.filter(id => id !== data.requesterId);
    this.client.emit('emit.to', { event: 'session.left', id: name, data: { client: data.requesterId } });
    return { status: 'success' };
  }

  @MessagePattern('emit.session.disconnect')
  onDisconnect(data: { requesterId: string }) {
    for (const name of Object.keys(this.sessions)) {
      if (this.sessions[name].host === data.requesterId || this.sessions[name].clients.includes(data.requesterId)) {
        this.onLeave({ data: { name }, requesterId: data.requesterId });
      }
    }
  }
}
