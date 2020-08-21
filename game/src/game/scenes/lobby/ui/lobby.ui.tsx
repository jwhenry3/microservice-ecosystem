import { BaseEntity }     from '../../base.entity';
import Modal              from '../../../../Modal';
import Login              from './Login';
import React              from 'react';
import { BaseScene }      from '../../base.scene';
import Register           from './Register';
import Characters         from './character/Characters';
import CreateCharacter    from './character/CreateCharacter';
import { CharacterModel } from '../../../../models/character.model';
import { UiEntity }       from './ui.entity';

export class LobbyUI extends BaseEntity {
  key = 'login';

  login!: UiEntity;
  register!: UiEntity;
  characters!: UiEntity;
  createCharacter!: UiEntity;

  constructor(scene: BaseScene) {
    super(scene, 0, 0, []);
    this.login           = new UiEntity(this.scene, 'login', this.getTemplate('login'));
    this.register        = new UiEntity(this.scene, 'register', this.getTemplate('register'));
    this.characters      = new UiEntity(this.scene, 'characters', this.getTemplate('characters'));
    this.createCharacter = new UiEntity(this.scene, 'create-character', this.getTemplate('create-character'));
    this.create();
  }

  create() {
    super.create();
    this.toLogin();
  }

  toCharacters      = () => {
    this.login.removeUI();
    this.register.removeUI();
    this.characters.addUI();
    this.createCharacter.removeUI();
  };
  toCreateCharacter = () => {
    this.login.removeUI();
    this.register.removeUI();
    this.characters.removeUI();
    this.createCharacter.addUI();
  };

  toRegister = () => {
    this.login.removeUI();
    this.register.addUI();
    this.characters.removeUI();
    this.createCharacter.removeUI();
  };

  toLogin = () => {
    this.login.addUI();
    this.register.removeUI();
    this.characters.removeUI();
    this.createCharacter.removeUI();
  };

  onCharacterSelected = (character: CharacterModel) => {
    this.scene.game.network.character.selectCharacter(character).then(result => {
      if (result) {
        this.scene.scene.stop('lobby');
        this.scene.scene.start('zone-1');
      }
    });
  };

  getTemplate(value: string) {
    return <Modal uiKey={value} key={value} parent={document.getElementById('ui-center-center') as HTMLElement}>
      {value === 'login'
       ?
       <Login loggedIn={this.toCharacters}
              network={this.scene.game.network}
              toRegister={this.toRegister}/>
       : ''}
      {value === 'register'
       ?
       <Register registered={this.toCharacters}
                 network={this.scene.game.network}
                 toLogin={this.toLogin}/>
       : ''}
      {value === 'characters'
       ?
       <Characters network={this.scene.game.network}
                   onSelected={this.onCharacterSelected}
                   toLogin={this.toLogin}
                   toCreateCharacter={this.toCreateCharacter}/>
       : ''}
      {value === 'create-character'
       ?
       <CreateCharacter network={this.scene.game.network}
                        toCharacters={this.toCharacters}/>
       : ''}
    </Modal>;
  }
}
