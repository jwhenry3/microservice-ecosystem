import React, { Component, ReactNode } from 'react';
import './Panel.scss';

export interface PanelProps {
  title?: string
  x?: number
  y?: number
  hasInitialPosition?: boolean
  children: ReactNode
  canDrag?: boolean
  close?: () => void
}

export interface PanelState {
  hasDragged: boolean
  mouseIsDown: boolean
  dragging: boolean
  originX: number
  originY: number
  x: number
  y: number
}

export default class Panel extends Component<PanelProps, PanelState> {

  constructor(props) {
    super(props);

    this.state = {
      hasDragged : false,
      mouseIsDown: false,
      dragging   : false,
      originX    : 0,
      originY    : 0,
      x          : this.props.x || 0,
      y          : this.props.y || 0,
    };
  }

  componentDidMount(): void {
    this.setState({
      hasDragged : false,
      mouseIsDown: false,
      dragging   : false,
      originX    : 0,
      originY    : 0,
      x          : this.props.x || 0,
      y          : this.props.y || 0,
    });
  }

  componentWillUnmount(): void {
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  timeout: any = null;
  onMouseDown  = (e: any) => {
    this.setState({
      ...this.state,
      mouseIsDown: true,
    });
    window.addEventListener('mouseup', this.onMouseUp);
    if (this.props.canDrag && !this.state.dragging) {
      let x        = e.clientX;
      let y        = e.clientY;
      let bounds   = ((e as MouseEvent).target as HTMLDivElement).getBoundingClientRect();
      this.timeout = setTimeout(() => {
        window.addEventListener('mousemove', this.onMouseMove);
        this.setState({
          hasDragged : true,
          mouseIsDown: true,
          dragging   : true,
          originX    : x - bounds.x,
          originY    : y - bounds.y,
          x          : x,
          y          : y,
        });
      }, 200);
    }
  };
  onMouseMove  = (e: any) => {
    if (this.props.canDrag) {
      if (this.state.dragging) {
        this.setState({
          hasDragged : true,
          mouseIsDown: true,
          dragging   : true,
          originX    : this.state.originX,
          originY    : this.state.originY,
          x          : e.clientX - this.state.originX,
          y          : e.clientY - this.state.originY,
        });
      }
    }
  };
  onMouseUp    = () => {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.props.canDrag) {
      if (this.state.dragging) {
        this.setState({
          hasDragged : true,
          mouseIsDown: false,
          dragging   : false,
          originX    : 0,
          originY    : 0,
          x          : this.state.x,
          y          : this.state.y,
        });
        return;
      }
    }
    this.setState({
      ...this.state,
      mouseIsDown: false,
    });
  };

  getStyle(): any {
    return this.props.hasInitialPosition || this.state.hasDragged
           ? { position: 'fixed', left: this.state.x, top: this.state.y } : {};
  }

  render() {
    if (!this.props.canDrag) {
      return <>
        <div className="panel" style={this.getStyle()}>
          <div className="panel-container">
            <div className={'panel-top ' + (this.props.title ? 'title' : '')}>
              {this.props.title}
            </div>
            {this.props.children}
          </div>
        </div>
      </>;
    }
    return <>
      <div className="panel" style={this.getStyle()}>
        <div className="panel-container">
          <div className={'panel-top ' + (this.props.title ? 'title' : '')} onMouseDown={this.onMouseDown}>
            {this.props.title}
          </div>
          {this.props.children}
        </div>
      </div>
    </>;
  }
}
