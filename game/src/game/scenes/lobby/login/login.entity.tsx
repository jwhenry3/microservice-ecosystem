import { BaseEntity }      from '../../base.entity';
import Observe             from '../../../../lib/observe';
import Modal               from '../../../../Modal';
import Login               from './Login';
import React               from 'react';
import { BehaviorSubject } from 'rxjs';
import { BaseScene }       from '../../base.scene';

export class LoginEntity extends BaseEntity {
  key = 'login';

  uiState = new BehaviorSubject({
    username: '',
    password: '',
  });

  constructor(scene: BaseScene) {
    super(scene, 0, 0, []);
    this.create();
  }

  login = (email: string, password: string) => {
    console.log('triggered!', email, password);
  };


  render = () => {
    return <Observe state={this.uiState} key="login">
      {(state) => (
        <Modal parent={document.getElementById('ui-center-center') as HTMLElement}>
          <Login submit={this.login}/>
        </Modal>
      )}
    </Observe>;
  };
}
