import React, { Component } from 'react';
import { SocketClient }     from '../../connection/socketClient';
import Login                from './Login';
import Register             from './Register';
import { GameClient }       from '../../phaser/game.client';
import { store }            from '../../state/store';
import { verifyToken }      from '../../state/actions/authentication';
import { connect }          from 'react-redux';
import { UiState }          from '../../state/ui.state';

export interface AccountState {
  login: boolean
  register: boolean
}

class Account extends Component<{ ui: UiState }, AccountState> {

  constructor(props) {
    super(props);
    this.state = {
      login   : false,
      register: false,
    };
  }

  componentDidMount(): void {
    SocketClient.socket.on('connect', async () => {
      if (this.props.ui.token) {
        if (await store.dispatch<any>(verifyToken())) {
          this.shouldDoNothing();
          return;
        }
      }
      this.shouldLogin();
    });
    SocketClient.socket.on('account.logged-in', () => {
      this.shouldDoNothing();
      if (this.props.ui.character) {
        console.log('reload world');
        GameClient.goToScene('world', { character: this.props.ui.character.sprite });
      } else {
        GameClient.goToScene('character-selection');
      }
    });
    SocketClient.socket.on('account.logged-out', () => this.shouldLogin());
    SocketClient.socket.on('disconnect', () => this.shouldDoNothing());
  }

  private shouldDoNothing() {
    this.setState({
      login   : false,
      register: false,
    });
  }

  private shouldLogin() {
    GameClient.goToScene('title');
    this.setState({
      login   : true,
      register: false,
    });
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

export default connect((state: any) => ({
  ui: state.ui,
}))(Account);
