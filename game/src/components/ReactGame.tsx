import { Component }          from 'react';
import React                  from 'react';
import Phaser                 from 'phaser';
import { Title }              from '../scenes/lobby/title';
import UIOverlay              from './UIOverlay';
import { throttle }           from 'lodash';
import { CharacterSelection } from '../scenes/lobby/character-selection';
import { World }              from '../scenes/world/world';


export interface ReactGameState {
  game: Phaser.Game | undefined
}

export default class ReactGame extends Component<any, ReactGameState> {
  game!: Phaser.Game;

  constructor(props) {
    super(props);
    this.state = {
      game: undefined,
    };
  }

  componentDidMount(): void {

    let game = new Phaser.Game({
      type  : Phaser.AUTO,
      banner: false,
      autoFocus: true,
      input: {
        queue: true
      } as any,
      parent: 'game-container',
      scale : {
        mode: Phaser.Scale.RESIZE,
      },
    });
    game.scene.add('title', Title);
    game.scene.add('character-selection', CharacterSelection);
    game.scene.add('world', World);

    this.setState({ game });
    const listener = throttle(() => {
      game.scene.getScenes(true).forEach((scene) => scene.events.emit('resize'));
    }, 300, { trailing: true, leading: true });
    window.addEventListener('resize', listener);
    game.events.on('shutdown', () => {
      window.removeEventListener('resize', listener);
    });
    game.scene.start('title');
    this.game = game;
    setTimeout(() => {
      game.scene.getScenes(true).forEach((scene) => scene.events.emit('resize'));
    }, 300);
  }

  componentWillUnmount(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  render() {
    return <div className="game">
      <div id="game-container"/>
      <UIOverlay/>
    </div>;
  }
}
