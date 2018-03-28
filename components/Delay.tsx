import * as React from 'react';

export class Delay extends React.Component<{ delay?: number }, { reached: boolean }> {
  state = {
    reached: false,
  };

  timeoutID: any;

  componentDidMount() {
    if (this.props.delay === 0) {
      this.setState({ reached: true });
    } else {
      this.timeoutID = setTimeout(() => {
        this.setState({ reached: true });
      }, this.props.delay || 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  render() {
    if (this.state.reached) {
      return this.props.children;
    }
    return null;
  }
}
