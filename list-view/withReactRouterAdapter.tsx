import * as React from 'react';
import * as qs from 'qs';
import { RouteComponentProps, withRouter } from 'react-router';
import { Props as ListViewProps, Filters } from './withListView';
import { getDisplayName } from '../utils';

interface Options {
  useReplaceFor: string[];
}

export function withReactRouterAdapter<T extends {}>(
  Wrapped: React.ComponentType<T & ListViewProps>,
  options?: Options
) {
  class ReactRouterWrapper extends React.Component<T & RouteComponentProps<{}>> {
    static displayName = `WithReactRouterAdapter(${getDisplayName(Wrapped)})`;

    onQueryParamsChange = (queryParams: Filters) => {
      const propsQueryParams = qs.parse(this.props.location.search.substr(1));
      const update = { ...(document.location as any), search: qs.stringify(queryParams) };
      const replaceFor = options ? options.useReplaceFor : [];
      let fn = this.props.history.push;
      for (const key of replaceFor) {
        if (propsQueryParams[key] !== queryParams[key]) {
          fn = this.props.history.replace;
          break;
        }
      }
      return fn(update);
    }

    render() {
      const queryParams = qs.parse(this.props.location.search.substr(1));
      return <Wrapped filters={queryParams} onFilterChange={this.onQueryParamsChange} {...this.props} />;
    }
  }

  return withRouter(ReactRouterWrapper);
}
