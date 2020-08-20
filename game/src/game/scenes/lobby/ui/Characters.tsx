import React, { Component }                           from 'react';
import { Network }                                    from '../../../network';
import { CharacterModel }                             from '../../../../models/character.model';
import { Button, IconButton, ListItem, ListItemText } from '@material-ui/core';
import './Characters.scss';
import Panel                                          from '../../../ui/Panel';
import { Subscription }                               from 'rxjs';
import { Close }                                      from '@material-ui/icons';

export interface CharactersProps {
  network: Network
  onSelected: (character: CharacterModel) => void
  toCreateCharacter: () => void
  toLogin: () => void
}

export default class Characters extends Component<CharactersProps, { characters: CharacterModel[] }> {
  reconnect!: Subscription;

  constructor(props) {
    super(props);
    this.state = {
      characters: [],
    };
  }

  componentDidMount(): void {
    this.getCharacters();
    this.reconnect = this.props.network.net.reconnect.subscribe(() => {
      this.getCharacters();
    });
  }

  componentWillUnmount(): void {
    this.reconnect.unsubscribe();
  }

  private getCharacters() {
    this.props.network.character.getCharacters().then(characters => {
      this.setState({ characters });
    });
  }

  logout   = () => {
    this.props.network.auth.logout().then(() => {
      this.props.network.auth.session = {
        email: '',
        token: '',
      };
      this.props.toLogin();
    });
  };
  onDelete = (e, character: CharacterModel) => {
    e.stopPropagation();
    this.props.network.character.deleteCharacter(character).then((result) => {
      this.getCharacters();
      if (!result) {
        alert('Could not delete ' + character.name);
      }
    });
  };


  render() {
    return <>
      <Panel uiName="characters" panelName="characters" canDrag={true} title="Characters" close={this.logout}>
        {
          this.state.characters.map(character => <ListItem key={character.id}
                                                           onClick={() => this.props.onSelected(character)}>
            <ListItemText primary={character.name}/>
            <IconButton onClick={(e) => this.onDelete(e, character)}>
              <Close/>
            </IconButton>
          </ListItem>)
        }
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
