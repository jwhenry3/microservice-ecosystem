import { BaseEntity }      from '../../base.entity';
import Observe             from '../../../../lib/observe';
import Modal               from '../../../../Modal';
import Login               from './Login';
import React               from 'react';
import { BehaviorSubject } from 'rxjs';
import { BaseScene }       from '../../base.scene';
import Register            from './Register';

export class LobbyUI extends BaseEntity {
  key = 'login';

  uiState = new BehaviorSubject({
    login          : true,
    register       : false,
    characters     : false,
    createCharacter: false,
  });

  constructor(scene: BaseScene) {
    super(scene, 0, 0, []);
    this.create();
  }

  toCharacters = () => {
    this.uiState.next({
      login          : false,
      register       : false,
      characters     : true,
      createCharacter: false,
    });
  };

  toRegister = () => {
    this.uiState.next({
      login          : false,
      register       : true,
      characters     : false,
      createCharacter: false,
    });
  };

  toLogin = () => {
    this.uiState.next({
      login          : true,
      register       : false,
      characters     : false,
      createCharacter: false,
    });
  };


  render = () => {
    return <Observe state={this.uiState} key="login">
      {(state) => (
        <Modal parent={document.getElementById('ui-center-center') as HTMLElement}>
          {state.login ? <Login loggedIn={this.toCharacters}
                                network={this.scene.game.network}
                                toRegister={this.toRegister}/> : ''}
          {state.register ? <Register registered={this.toCharacters}
                                      network={this.scene.game.network}
                                      toLogin={this.toLogin}/> : ''}
        </Modal>
      )}
    </Observe>;
  };
}
