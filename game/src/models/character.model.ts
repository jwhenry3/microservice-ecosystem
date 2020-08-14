export interface CharacterModel {
  id?: number
  name: string
  gender: string
  hairStyle: number // "1" ~ "10"
  hairColor: string // #dd7700
  skinTone: string // #daff00
  race: string

}

export const CHARACTER_FIELDS = ['name', 'gender', 'hairStyle', 'hairColor', 'skinTone', 'race'];
export const GENDER           = ['male', 'female'];
export const HAIR_STYLE       = new Array(20).map((val, i) => i);
export const HAIR_COLOR       = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];
export const SKIN_TONE = ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'];
export const RACE             = ['human', 'orc'];
