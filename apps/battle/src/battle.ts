import { battleOptions } from './battleOptions';

export class Battle {


  constructor(public map: string, public mob: string | null) {
    if (battleOptions[map]) {
      if (battleOptions[map][mob]) {
        let config = battleOptions[map][mob];
        let rand   = Math.round(Math.random() * config.length);
        console.log(rand);

      }
    }
  }
}
