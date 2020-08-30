import { AbilityPrerequisite } from './ability-prerequisite';

export class Ability {
  name                                                             = '';
  potency                                                          = 1;
  accuracy                                                         = 1;
  turnDuration                                                     = 1;
  targetType: 'enemy' | 'ally'                                     = 'enemy';
  targetRange: 'one' | 'all' | 'row' | 'column' | 'front' | 'back' = 'one';
  prerequesite                                                     = new AbilityPrerequisite();
}
