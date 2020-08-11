import React, { Component, ReactNode } from 'react';
import ReactDOM                        from 'react-dom';

export interface ModalProps {
  parent: HTMLElement
  children: ReactNode
}

class Modal extends Component<ModalProps, any> {
  el = document.createElement('div');

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    this.props.parent.appendChild(this.el);
  }

  componentWillUnmount() {
    this.props.parent.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

export default Modal;
