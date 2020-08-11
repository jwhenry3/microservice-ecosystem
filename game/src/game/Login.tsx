import React, { Component } from 'react';

export default class Login extends Component<any, any> {

  render() {
    return <div className="login">Works! {JSON.stringify(this.props.data || {})}</div>;
  }
}
