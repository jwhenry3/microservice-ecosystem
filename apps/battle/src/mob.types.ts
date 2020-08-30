export interface MobType {
  type: string
  name: string
  levelRange: [number, number],
  base: {
    hp: number
    patk: number
    pacc: number
    pdef: number
    peva: number
    matk: number
    macc: number
    mdef: number
    meva: number
    element: string
  }
  mod: {
    hp: number
    patk: number
    pacc: number
    pdef: number
    peva: number
    matk: number
    macc: number
    mdef: number
    meva: number
  }
  abilities: string[]
}

export const goblin: MobType = {
  type      : 'goblin',
  name      : 'Goblin',
  levelRange: [1, 4],
  base      : {
    hp     : 100,
    patk   : 4,
    pacc   : 4,
    peva   : 4,
    pdef   : 4,
    matk   : 1,
    macc   : 1,
    mdef   : 1,
    meva   : 1,
    element: 'earth',
  },
  mod       : {
    hp  : 10,
    patk: 2,
    pacc: 2,
    peva: 2,
    pdef: 2,
    matk: 1,
    macc: 1,
    mdef: 1,
    meva: 1,
  },
  abilities : ['scratch', 'block'],
};
