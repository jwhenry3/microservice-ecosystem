import { Component, ReactNode }           from 'react';
import ReactDOM                           from 'react-dom';
import { Subscription }                   from 'rxjs';
import { displayOrder, updateComponents } from './ui-components';

export interface ModalProps {
  uiKey?: string
  parent: HTMLElement
  children: ReactNode
}

class Modal extends Component<ModalProps, any> {
  el!: HTMLDivElement;
  sub!: Subscription;

  constructor(props) {
    super(props);
    this.el           = document.createElement('div');
    this.el.className = 'modal';
  }

  componentDidMount() {
    if (this.props.uiKey) {
      this.sub = updateComponents.subscribe(() => {
        this.el.style.zIndex = '' + displayOrder.indexOf(this.props.uiKey as string);
      });
    }
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
    if (this.sub) {
      this.sub.unsubscribe();
      delete this.sub;
    }
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

export default Modal;
