import React, { Component } from 'react';
import { SocketClient }     from '../../connection/socketClient';

export interface CharacterSelectionState {
  list: boolean
  create: boolean
}

export class CharacterSelection extends Component<any, CharacterSelectionState> {

  constructor(props) {
    super(props);
    this.state = {
      list  : false,
      create: false,
    };
  }

  componentDidMount(): void {
    SocketClient.socket.on('account.logged-in', () => {
      // if (SocketClient.character.id) {
      //   console.log('reload world');
      //   this.goToScene('world', { character: SocketClient.character.sprite });
      // } else {
      //   this.goToScene('character-selection');
      // }
    });
  }

  render() {
    return <div>Character Selection</div>;
  }
}
