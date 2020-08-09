import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';

export interface Character {
  id: number,
  name: string,
  sprite: string
}

export interface UiState {
  token: string
  email: string
  character?: Character
  characters?: Character[]
}

export const ui = createSlice<UiState, SliceCaseReducers<UiState>>({
  name        : 'ui',
  initialState: {
    token     : '',
    email     : '',
    character : undefined,
    characters: [],
  },
  reducers    : {
    'account.logged-in' : (state, action) => ({
      token     : action.payload.token,
      email     : action.payload.email,
      character : undefined,
      characters: [],
    }),
    'account.logged-out': (state, action) => ({
      token     : '',
      email     : '',
      character : undefined,
      characters: [],
    }),
    'character.selected': (state, action) => {
      state.character = action.payload;
    },
  },
});

export const loggedIn          = ui.actions['account.logged-in'];
export const loggedOut         = ui.actions['account.logged-in'];
export const selectedCharacter = ui.actions['character.selected'];

