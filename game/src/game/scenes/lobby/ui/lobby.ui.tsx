import { BaseEntity }      from '../../base.entity';
import Observe             from '../../../../lib/observe';
import Modal               from '../../../../Modal';
import Login               from './Login';
import React               from 'react';
import { BehaviorSubject } from 'rxjs';
import { BaseScene }       from '../../base.scene';
import Register            from './Register';
import Characters          from './Characters';
import CreateCharacter     from './CreateCharacter';
import { CharacterModel }  from '../../../../../../lib/models/character.model';

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

  toCharacters      = () => {
    this.uiState.next({
      login          : false,
      register       : false,
      characters     : true,
      createCharacter: false,
    });
  };
  toCreateCharacter = () => {
    this.uiState.next({
      login          : false,
      register       : false,
      characters     : true,
      createCharacter: true,
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

  onCharacterSelected = (character: CharacterModel) => {

  };


  render = () => {
    return <Observe state={this.uiState} key="login">
      {(state) => (
        <Modal parent={document.getElementById('ui-center-center') as HTMLElement}>
          {state.login
           ?
           <Login loggedIn={this.toCharacters}
                  network={this.scene.game.network}
                  toRegister={this.toRegister}/>
           : ''}
          {state.register
           ?
           <Register registered={this.toCharacters}
                     network={this.scene.game.network}
                     toLogin={this.toLogin}/>
           : ''}
          {state.characters
           ?
           <Characters network={this.scene.game.network}
                       onSelected={this.onCharacterSelected}
                       toLogin={this.toLogin}
                       toCreateCharacter={this.toCreateCharacter}/>
           : ''}
          {state.createCharacter
           ?
           <CreateCharacter network={this.scene.game.network}
                            toCharacters={this.toCharacters}/>
           : ''}
        </Modal>
      )}
    </Observe>;
  };
}
