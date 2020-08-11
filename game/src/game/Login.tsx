import React, { Component } from 'react';

export default class Login extends Component<any, { timeout: any, tick: number }> {
  constructor(props) {
    super(props);
    this.state = {
      tick   : 0,
      timeout: -1,
    };
  }

  componentDidMount(): void {
    let timeout = setInterval(() => {
      this.setState({ timeout: this.state.timeout as any, tick: this.state.tick + 1 });
    }, 1000);
    this.setState({ timeout: timeout as any, tick: 0 });
  }

  componentWillUnmount(): void {
    console.log('unmounting');
    clearInterval(this.state.timeout);
  }

  render() {
    return <div>Works! ({this.state.tick})</div>;
  }
}
