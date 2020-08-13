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
}

export default class Characters extends Component<CharactersProps, CharacterModel[]> {


  componentDidMount(): void {
    this.props.network.character.getCharacters().then(characters => this.setState(characters));
  }

  render() {
    return <>
      <div className="backdrop"/>
      <Panel canDrag={true} title="Characters">
        <Button type="button" onClick={this.props.toCreateCharacter}>
          Create Character
        </Button>
      </Panel>
    </>;
  }
}
