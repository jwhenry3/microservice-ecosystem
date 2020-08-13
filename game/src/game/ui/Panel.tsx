import React, { Component, ReactNode } from 'react';
import './Panel.scss';
import { IconButton }                  from '@material-ui/core';
import { Close, OpenWith }             from '@material-ui/icons';

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
  }

  componentWillUnmount(): void {
    window.removeEventListener('mousemove', this.onMouseMove);
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
  onMouseUp   = () => {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
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

  onRef = (node: HTMLDivElement) => {
    if (node) {
      this.ref   = node;
      let bounds = node.getBoundingClientRect();
      this.setState({
        hasDragged : true,
        mouseIsDown: false,
        dragging   : false,
        originX    : 0,
        originY    : 0,
        x          : bounds.x,
        y          : bounds.y,
      });
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

  render() {
    if (!this.props.canDrag) {
      return <>
        <div ref={this.onRef} className="panel" style={this.getStyle()}>
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
      <div ref={this.onRef} className="panel" style={this.getStyle()}>
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
