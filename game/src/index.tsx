import React                from 'react';
import ReactDOM             from 'react-dom';
import './index.scss';
import * as serviceWorker   from './serviceWorker';
import 'phaser';
import { GameClient }       from './game/game.client';
import App                  from './App';
import { focusedCanvas }    from './game/ui/events';
import { unFocusComponent } from './ui-components';

GameClient.start();
ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
canvas.addEventListener('mousedown', () => {
  canvas.focus();
  focusedCanvas.next();
  unFocusComponent();
});
