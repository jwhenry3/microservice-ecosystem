export interface MobType {
  type: string
  name: string
  levelRange: [number,number],
  base: {
    hp: number
    patk: number
    pdef: number
    matk: number
    mdef: number
    element: string
  }
  mod: {
    hp: number
    patk: number
    pdef: number
    matk: number
    mdef: number
  }
  abilities: string[]
}

export const goblin: MobType = {
  type     : 'goblin',
  name     : 'Goblin',
  levelRange: [1,4],
  base     : {
    hp     : 100,
    patk   : 4,
    pdef   : 4,
    matk   : 1,
    mdef   : 1,
    element: 'earth',
  },
  mod      : {
    hp  : 10,
    patk: 2,
    pdef: 2,
    matk: 1,
    mdef: 1,
  },
  abilities: ['scratch', 'block'],
};
