import React, { Component } from 'react';
import { Button }           from '@material-ui/core';

export interface LoginProps {
  submit: (email: string, password: string) => void
}

export default class Login extends Component<LoginProps, any> {

  render() {
    return <div className="login">
      <Button variant="contained" onClick={() => this.props.submit('test@email.com', 'test')}>Login</Button>
    </div>;
  }
}
