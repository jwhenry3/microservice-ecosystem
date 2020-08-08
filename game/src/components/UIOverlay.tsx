import React, { Component } from 'react';
import './UIOverlay.scss';
import Connection           from './global/Connection';
import Login                from './lobby/Login';

export default class UIOverlay extends Component<any, any> {


  render() {
    return <div className="ui-overlay">
      <div className="top-left">
      </div>
      <div className="top-right">
        <Connection/>
      </div>
      <div className="bottom-left">
      </div>
      <div className="bottom-right">
      </div>
      <div className="center">
        <Login/>
      </div>
    </div>;
  }
}
