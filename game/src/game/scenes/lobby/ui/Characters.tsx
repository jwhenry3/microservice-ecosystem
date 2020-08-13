import React, { Component } from 'react';
import { Network }          from '../../../network';
import { CharacterModel }   from '../../../../../../lib/models/character.model';
import { Button }           from '@material-ui/core';
import './Characters.scss';
import Panel                from '../../../ui/Panel';

export interface CharactersProps {
  network: Network
  onSelected: (character: CharacterModel) => void
  toCreateCharacter: () => void
  toLogin: () => void
}

export default class Characters extends Component<CharactersProps, CharacterModel[]> {


  componentDidMount(): void {
    this.props.network.character.getCharacters().then(characters => this.setState(characters));
  }

  logout = () => {
    this.props.network.auth.logout().then(() => {
      console.log('logged out');
      this.props.network.auth.session = {
        email: '',
        token: '',
      };
      this.props.toLogin();
    });
  };

  render() {
    return <>
      <Panel uiName="characters" panelName="characters" canDrag={true} title="Characters" close={this.logout}>
        <Button type="button" onClick={this.props.toCreateCharacter}>
          Create Character
        </Button>
        <Button type="button" onClick={this.logout}>
          Logout
        </Button>
      </Panel>
    </>;
  }
}
