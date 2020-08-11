import React, { Component } from 'react';
import './App.css';
import { GameClient }       from './game/game.client';

class App extends Component<any, any> {

  client!: GameClient;

  componentDidMount(): void {
    this.client = new GameClient();
  }


  render() {
    return (
      <div id="game-container">

      </div>
    );
  }
}

export default App;
