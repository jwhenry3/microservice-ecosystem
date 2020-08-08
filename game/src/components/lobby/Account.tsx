import React, { Component } from 'react';
import { SocketClient }     from '../../connection/socketClient';
import Login                from './Login';
import Register             from './Register';

export interface AccountState {
  loggedIn: boolean
  login: boolean
  register: boolean
}

export class Account extends Component<any, AccountState> {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      login   : false,
      register: false,
    };
  }

  componentDidMount(): void {
    SocketClient.socket.on('connect', () => {
      this.setState({
        loggedIn: false,
        login   : true,
        register: false,
      });
    });
    SocketClient.socket.on('logged-in', () => {
      this.setState({
        loggedIn: true,
        login   : false,
        register: false,
      });
    });
    SocketClient.socket.on('logged-out', () => {
      this.setState({
        loggedIn: false,
        login   : true,
        register: false,
      });
    });
    SocketClient.socket.on('disconnect', () => {
      this.setState({
        loggedIn: false,
        login   : false,
        register: false,
      });
    });
  }

  componentWillUnmount(): void {
  }

  render() {
    if (this.state.loggedIn) {
      return '';
    }
    return (<>
      {this.state.login ? <Login/> : ''}
      {this.state.register ? <Register/> : ''}
    </>);
  }
}
