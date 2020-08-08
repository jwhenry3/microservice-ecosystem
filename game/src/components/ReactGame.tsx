import { Component }  from 'react';
import React          from 'react';
import UIOverlay      from './UIOverlay';
import { GameClient } from '../phaser/game.client';


export default class ReactGame extends Component<any, any> {

  componentDidMount(): void {
    GameClient.start();
  }

  componentWillUnmount(): void {
    GameClient.stop();
  }

  render() {
    return <div className="game">
      <div id="game-container"/>
      <UIOverlay/>
    </div>;
  }
}
