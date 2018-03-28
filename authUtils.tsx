import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { History } from 'history';

interface Options {
  redirect: string;
}

export function requireAuthenticationFactory<T extends Options>(
  checkUser: (history: History, options?: T) => void
) {
  return (Component: React.ComponentType, options?: T) => {
    type Props = RouteComponentProps<{}>;

    class AuthComponent extends React.Component<Props> {
      componentWillMount() {
        checkUser(this.props.history, options);
      }

      componentWillReceiveProps(nextProps: Props) {
        checkUser(nextProps.history, options);
      }

      render() {
        return <Component {...this.props} />;
      }
    }
    return AuthComponent;
  };
}
