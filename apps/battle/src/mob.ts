import { MobType } from './mob.types';

export class Mob {
  type  = '';
  name  = '';
  hp    = 0;
  maxhp = 0;
  patk  = 0;
  pdef  = 0;
  matk  = 0;
  mdef  = 0;

  constructor(public config: MobType, public level: number = null) {
    this.type = config.type;
    this.name = config.name;
    if (!level) {
      let range = config.levelRange[1] - config.levelRange[0];
      if (range > 0) {
        this.level = Math.round(Math.random() * range) + config.levelRange[0];
      } else {
        this.level = config.levelRange[0];
      }
    }
    this.hp    = this.calculate('hp', config);
    this.maxhp = this.hp;
    this.patk  = this.calculate('patk', config);
    this.pdef  = this.calculate('pdef', config);
    this.matk  = this.calculate('matk', config);
    this.mdef  = this.calculate('mdef', config);
  }

  calculate(field: string, config: MobType) {
    return config.base[field] + (config.mod[field] * this.level);
  }
}
