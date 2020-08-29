import { BaseEntity }     from '../base.entity';
import Modal              from '../../../Modal';
import Login              from './Login';
import React              from 'react';
import { BaseScene }      from '../../scenes/base.scene';
import Register           from './Register';
import Characters         from './character/Characters';
import CreateCharacter    from './character/CreateCharacter';
import { CharacterModel } from '../../../models/character.model';
import { UiEntity }       from '../../scenes/client/ui.entity';
import { NetworkedGame }  from '../../networked.game';

export class LobbyUI extends BaseEntity {
  key = 'login';

  login!: UiEntity;
  register!: UiEntity;
  characters!: UiEntity;
  createCharacter!: UiEntity;

  constructor(public scene: BaseScene & { game: NetworkedGame }) {
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

  reset = () => {
    this.login.removeUI();
    this.register.removeUI();
    this.characters.removeUI();
    this.createCharacter.removeUI();
  };

  toCharacters      = () => {
    this.reset();
    this.characters.addUI();
  };
  toCreateCharacter = () => {
    this.reset();
    this.createCharacter.addUI();
  };

  toRegister = () => {
    this.reset();
    this.register.addUI();
  };

  toLogin = () => {
    this.reset();
    this.login.addUI();
  };

  onCharacterSelected = (character: CharacterModel) => {
    this.scene.game.network.character.selectCharacter(character).then(async result => {
      if (result) {
        let joined = await this.scene.game.network.map.join(character.id as number) as any;
        if (joined) {
          this.scene.game.network.character.currentId = character.id as number;
          this.scene.scene.stop('lobby');
          this.scene.scene.start(joined.map);
        }
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
