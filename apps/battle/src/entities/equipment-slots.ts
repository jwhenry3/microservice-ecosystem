import { Equipment } from './equipment';

export class EquipmentSlots {

  head?: Equipment     = null;
  neck?: Equipment     = null;
  arms?: Equipment     = null;
  fingers: Equipment[] = [];
  legs?: Equipment     = null;
  feet?: Equipment     = null;
}
