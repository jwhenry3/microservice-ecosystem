import React, { Component } from 'react';
import { SocketClient }     from '../../connection/socketClient';
import './Connection.scss';
import { Icon }             from '@material-ui/core';

export interface ConnectionState {
  connecting: boolean
}

export default class Connection extends Component<any, ConnectionState> {

  constructor(props: any) {
    super(props);
    this.state = {
      connecting: true,
    };
  }

  componentDidMount(): void {
    SocketClient.socket.on('connect', () => {
      this.setState({
        connecting: false,
      });
    });
    SocketClient.socket.on('disconnect', () => {
      this.setState({
        connecting: true,
      });
    });
  }

  render() {
    return <div className="connection">
      {!this.state.connecting ? <Icon>wifi</Icon> : <Icon className="not-connected">wifi</Icon>}
      {!this.state.connecting ? '' : <Icon className="warn">priority_high</Icon>}
    </div>;
  }
}
