export interface CharacterModel {
  id?: number
  name: string
  gender: string
  hairStyle: string // "1" ~ "10"
  hairColor: string // #dd7700
  skinTone: string // #daff00
  race: string

}

export const CHARACTER_FIELDS = ['name', 'gender', 'hairStyle', 'hairColor', 'skinTone', 'race'];
export const GENDER           = ['male', 'female'];
export const HAIR_STYLE       = new Array(10).map((v, i) => i + 1);
export const RACE             = ['human'];
