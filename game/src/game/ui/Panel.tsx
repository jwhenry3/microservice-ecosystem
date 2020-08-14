import React, { Component, ReactNode } from 'react';
import './Panel.scss';
import { IconButton }                  from '@material-ui/core';
import { Close, OpenWith }             from '@material-ui/icons';
import { focusComponent }              from '../../ui-components';

export interface PanelProps {
  uiName?:string
  title?: string
  x?: number
  y?: number
  hasInitialPosition?: boolean
  children: ReactNode
  canDrag?: boolean
  close?: () => void
  panelName?:string
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
  ref!: HTMLDivElement;

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
      hasDragged : !!this.props.hasInitialPosition,
      mouseIsDown: false,
      dragging   : false,
      originX    : 0,
      originY    : 0,
      x          : this.props.x || 0,
      y          : this.props.y || 0,
    });
    if (!!this.props.hasInitialPosition || this.props.canDrag) {
      window.addEventListener('resize', this.snapPosition);
    }
  }


  componentWillUnmount(): void {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.snapPosition);
  }

  onMouseDown = (e: any) => {
    this.setState({
      ...this.state,
      mouseIsDown: true,
    });
    window.addEventListener('mouseup', this.onMouseUp);
    if (this.props.canDrag && !this.state.dragging) {
      let x      = e.clientX;
      let y      = e.clientY;
      let bounds = this.ref.getBoundingClientRect();
      this.setState({
        hasDragged : true,
        mouseIsDown: true,
        dragging   : true,
        originX    : x - bounds.x,
        originY    : y - bounds.y,
        x          : bounds.x,
        y          : bounds.y,
      });
      window.addEventListener('mousemove', this.onMouseMove);
    }
  };
  onMouseMove = (e: any) => {
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
  onMouseUp   = (e: any) => {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.props.canDrag) {
      if (this.state.dragging) {
        this.snapPosition();
        return;
      }
    }
    this.setState({
      ...this.state,
      mouseIsDown: false,
    });
  };

  snapPosition = () => {
    let snap = this.getSnappedPosition();
    this.setState({
      hasDragged : true,
      mouseIsDown: false,
      dragging   : false,
      originX    : 0,
      originY    : 0,
      x          : snap.x,
      y          : snap.y,
    });
  };

  private getSnappedPosition() {
    let bounds = this.ref.getBoundingClientRect();
    let snap   = {
      x: Math.round(bounds.x / 16) * 16,
      y: Math.round(bounds.y / 16) * 16,
    };
    if (snap.x < 16) {
      snap.x = 16;
    }
    if (snap.y < 16) {
      snap.y = 16;
    }
    if (snap.x + this.ref.offsetWidth > window.innerWidth - 16) {
      snap.x = window.innerWidth - 16 - this.ref.offsetWidth;
    }
    if (snap.y + this.ref.offsetHeight > window.innerHeight - 16) {
      snap.y = window.innerHeight - 16 - this.ref.offsetHeight;
    }
    return snap;
  }

  onRef = (node: HTMLDivElement) => {
    if (node) {
      this.ref   = node;
      this.snapPosition();
    }
  };

  getStyle(): any {
    return this.state.hasDragged
           ? { position: 'fixed', left: this.state.x, top: this.state.y, transform: 'inherit' } : {};
  }

  renderClose() {
    if (this.props.close) {
      return <IconButton onClick={this.props.close}><Close/></IconButton>;
    }
    return '';
  }

  focus = () => {
    if (this.props.uiName) {
      focusComponent(this.props.uiName);
    }
  };

  render() {
    if (!this.props.canDrag) {
      return <>
        <div ref={this.onRef} className="panel" style={this.getStyle()} onClick={this.focus}>
          <div className="panel-container">
            <div className={'panel-top ' + (this.props.title ? 'title' : '')}>
              <div className="left">
              </div>
              <div className="title">{this.props.title}</div>
              <div className="right">
                {this.renderClose()}
              </div>
            </div>
            {this.props.children}
          </div>
        </div>
      </>;
    }
    return <>
      <div ref={this.onRef} className={'panel ' + (this.props.panelName || '') } style={this.getStyle()} onMouseDown={this.focus}>
        <div className="panel-container">
          <div className={'panel-top ' + (this.props.title ? 'title' : '')} onMouseDown={this.onMouseDown}>
            <div className="left">
              <IconButton><OpenWith/></IconButton>
            </div>
            <div className="title">{this.props.title}</div>
            <div className="right">
              {this.renderClose()}
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    </>;
  }
}
