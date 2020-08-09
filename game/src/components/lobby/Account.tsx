import React, { Component } from 'react';
import { SocketClient }     from '../../connection/socketClient';
import Login                from './Login';
import Register             from './Register';
import { GameClient }       from '../../phaser/game.client';

export interface AccountState {
  login: boolean
  register: boolean
}

export class Account extends Component<any, AccountState> {

  constructor(props) {
    super(props);
    this.state = {
      login   : false,
      register: false,
    };
  }

  componentDidMount(): void {
    SocketClient.socket.on('connect', () => {
      if (SocketClient.token) {
        SocketClient.socket.emit('request', {
          event: 'account.verify',
          data : { token: SocketClient.token },
        }, (result) => {
          if (!result?.id) {
            this.setState({
              login   : true,
              register: false,
            });
            SocketClient.token = '';
            SocketClient.email = '';
            this.goToScene('title');
          } else {
            SocketClient.email = result.email;
            this.goToScene('character-selection');
          }
        });
      } else {
        this.setState({
          login   : true,
          register: false,
        });
        this.goToScene('title');
      }
    });
    SocketClient.socket.on('account.logged-in', () => {
      this.setState({
        login   : false,
        register: false,
      });
      this.goToScene('character-selection');
    });
    SocketClient.socket.on('account.logged-out', () => {
      this.setState({
        login   : true,
        register: false,
      });
      this.goToScene('title');
    });
    SocketClient.socket.on('disconnect', () => {
      this.setState({
        login   : false,
        register: false,
      });
    });
  }

  private goToScene(key: string) {
    GameClient.game.scene.getScenes(true).forEach(scene => scene.scene.stop());
    GameClient.game.scene.start(key);
  }

  componentWillUnmount(): void {
  }

  onRegister = () => this.setState({ login: false, register: true });
  onLogin    = () => this.setState({ login: true, register: false });

  render() {
    return (<>
      {this.state.login ? <Login onRegister={this.onRegister}/> : ''}
      {this.state.register ? <Register onLogin={this.onLogin}/> : ''}
    </>);
  }
}
