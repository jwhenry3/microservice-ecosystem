export interface CharacterModel {
  id?: number
  name: string
  accountId?: number
  gender: string
  hairStyle: number // "1" ~ "10"
  hairColor: string // #dd7700
  skinTone: string // #daff00
  race: string

}

export const CHARACTER_FIELDS = ['name', 'gender', 'hairStyle', 'hairColor', 'skinTone', 'race'];
export const GENDER           = ['male', 'female'];
export const HAIR_STYLE       = new Array(20).map((val, i) => i);
export const HAIR_COLOR       = ['#9a3300', '#4f1a00', '#241c11', '#debe99', '#aa8866', '#d65624', '#EFCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#EB9694', '#FAD0C3', '#FEF3BD', '#C4DEF6'];
export const SKIN_TONE        = ['#8D5524', '#C68642', '#E0AC69', '#F1C27D', '#FFDBAC', '#FBE5E4'];
export const RACE             = ['human', 'orc'];
