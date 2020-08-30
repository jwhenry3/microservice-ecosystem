import { options } from './options';

export class Battle {


  constructor(public map: string, public mob: string | null) {
    if (options[map]) {
      if (options[map][mob]) {
        let config = options[map][mob];
        let rand   = Math.round(Math.random() * config.length);
        console.log(rand);

      }
    }
  }
}
