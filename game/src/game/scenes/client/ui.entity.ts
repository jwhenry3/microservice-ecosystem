import { BaseEntity } from '../../ui/base.entity';
import { ReactNode }  from 'react';

export class UiEntity extends BaseEntity {

  constructor(scene, public key:string, private template: ReactNode) {
    super(scene);
  }

  render = () => this.template;
}
