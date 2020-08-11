import React, { Component, ReactNode } from 'react';
import ReactDOM                        from 'react-dom';
import Login                from './Login';
export interface PortalProps {
  children:ReactNode
  parent:HTMLElement
}
export class Portal extends Component<any, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.props.parent,
    );
  }
}
