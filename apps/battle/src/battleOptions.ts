import { goblin } from './mob.types';

export const battleOptions = {
  'zone-1': {
    mobs  : {
      'goblin': [
        [goblin],
        [goblin, goblin],
        [goblin, goblin, goblin],
      ],
    },
    random: [
      [goblin],
      [goblin, goblin],
      [goblin, goblin, goblin],
    ],

  },
};
