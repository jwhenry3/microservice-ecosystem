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
        console.log('verify!');
        SocketClient.socket.emit('request', {
          event: 'account.verify',
          data : { token: SocketClient.token },
        }, (result) => {
          console.log('result', result);
          if (!result?.id) {
            this.setState({
              login   : true,
              register: false,
            });
            SocketClient.token     = '';
            SocketClient.email     = '';
            SocketClient.character = {
              id    : null,
              name  : '',
              sprite: '',
            };
            this.goToScene('title');
          } else {
            SocketClient.email = result.email;
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
      if (SocketClient.character.id) {
        console.log('reload world');
        this.goToScene('world', { character: SocketClient.character.sprite });
      } else {
        this.goToScene('character-selection');
      }
    });
    SocketClient.socket.on('account.logged-out', () => {
      this.setState({
        login   : true,
        register: false,
      });
      SocketClient.character = {
        id    : null,
        name  : '',
        sprite: '',
      };
      this.goToScene('title');
    });
    SocketClient.socket.on('disconnect', () => {
      this.setState({
        login   : false,
        register: false,
      });
    });
  }

  private goToScene(key: string, data?: any) {
    GameClient.game.scene.stop(key);
    let scenes = GameClient.game.scene.getScenes(true);
    for (let scene of scenes) {
      scene.scene.stop();
    }
    GameClient.game.scene.start(key, data);
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
