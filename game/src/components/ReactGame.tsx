import { Component } from 'react';
import React         from 'react';
import Phaser        from 'phaser';
import { Title }     from '../scenes/title';
import UIOverlay     from './UIOverlay';


export interface ReactGameState {
  game: Phaser.Game | undefined
}

export default class ReactGame extends Component<any, ReactGameState> {

  constructor(props) {
    super(props);
    this.state = {
      game: undefined,
    };
  }

  componentDidMount(): void {

    let game = new Phaser.Game({
      type  : Phaser.AUTO,
      parent: 'game-container',
      scale : {
        mode: Phaser.Scale.RESIZE,
      },
      scene : [Title],
    });
    this.setState({ game });
    game.scene.start('title');
  }

  render() {
    return <div className="game">
      <div id="game-container"/>
      <UIOverlay/>
    </div>;
  }
}
