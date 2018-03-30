import * as React from 'react';
import isEqual from 'lodash-es/isEqual';
import makeCancelable from '../makeCancelable';
import omit from 'lodash-es/omit';

export interface Filters {
  [key: string]: string;
}

export interface ListViewInterface<T> {
  entries: T[];
  count: number;
  selectedPage: number;
  filters: Filters;
  onFilterChange: (filters: Filters) => any;
  onPageChange: (pageNumber: number) => any;
  onPageSizeChange: (pageSize: number) => any;
  isLoading: boolean;
  pageSize: number;
}

export interface Props {
  filters: Filters;
  onFilterChange: (filters: Filters) => any;
}

interface State<T> {
  pages: {
    [page: number]: {
      entries: T[];
      status: 'fetched' | 'notFetched' | 'fetching';
    };
  };
  count: number;
  inited: boolean;
}

export function withListView<T>(
  fetchPage: (filters: Filters) => Promise<{ entries: T[]; count: number }>,
  defaultPageSize: number,
  Wrapped: React.ComponentType<ListViewInterface<T>>
) {
  class ListViewWrapper extends React.Component<Props, State<T>> {
    static extractPageInfo(filters: Filters): [number, number, { [key: string]: string }] {
      const { page, page_size, ...rest } = filters;
      let selectedPage: number;
      try {
        selectedPage = parseInt(page, 10) || 1;
      } catch (e) {
        selectedPage = 1;
      }
      let selectedPageSize: number;
      try {
        selectedPageSize = parseInt(page_size, 10) || defaultPageSize;
      } catch (e) {
        selectedPageSize = defaultPageSize;
      }
      return [selectedPage, selectedPageSize, rest];
    }

    state: State<T> = {
      pages: {},
      count: 0,
      inited: false,
    };

    cancelableFetch: {
      cancel: () => void;
      promise: Promise<{ entries: T[]; count: number }>;
    } | null = null;

    componentDidMount() {
      this.fetch(this.props.filters);
    }

    componentWillUnmount() {
      if (this.cancelableFetch) {
        this.cancelableFetch.cancel();
      }
    }

    componentWillReceiveProps(nextProps: Props) {
      if (!this.state.inited) {
        return;
      }
      const { page, ...params } = this.props.filters;
      const [nextPage] = ListViewWrapper.extractPageInfo(nextProps.filters);
      const updatedParams = omit(nextProps.filters, 'page');
      if (!isEqual(params, updatedParams)) {
        this.setState({ pages: {}, count: 0 }, () => {
          this.fetch(nextProps.filters);
        });
      } else if (this.getPageStatus(nextPage) === 'notFetched') {
        this.fetch(nextProps.filters);
      }
    }

    fetch(filters: Filters) {
      const [page] = ListViewWrapper.extractPageInfo(filters);
      this.setState({
        pages: {
          ...this.state.pages,
          [page]: { entries: [], status: 'fetching' },
        },
        inited: true,
      });
      this.cancelableFetch = makeCancelable(fetchPage(filters));
      this.cancelableFetch.promise.then(
        ({ entries, count }) => {
          this.cancelableFetch = null;
          this.setState({
            pages: {
              ...this.state.pages,
              [page]: { entries, status: 'fetched' },
            },
            count,
          });
        },
        error => {
          this.cancelableFetch = null;
          if (error.isCanceled) {
            return;
          }
          if (error.response && error.response.status === 404) {
            this.setState({
              pages: {
                ...this.state.pages,
                [page]: { entries: [], status: 'fetched' },
              },
            });
          } else {
            throw error;
          }
        }
      );
    }

    onFilterChange = (filters: Filters) => {
      const [page, pageSize] = ListViewWrapper.extractPageInfo(filters);
      this.props.onFilterChange({
        ...filters,
        page: String(page),
        page_size: String(pageSize),
      });
    };

    onPageChange = (pageNumber: number) => {
      this.props.onFilterChange({
        ...this.props.filters,
        page: String(pageNumber),
      });
    };

    onPageSizeChange = (pageSize: number) => {
      this.props.onFilterChange({
        ...this.props.filters,
        page_size: String(pageSize),
      });
    };

    getPageStatus(page: number) {
      return this.state.pages[page] ? this.state.pages[page].status : 'notFetched';
    }

    render() {
      const { filters, onFilterChange, ...props } = this.props;
      const [page, pageSize, childFilters] = ListViewWrapper.extractPageInfo(filters);
      return (
        <Wrapped
          {...props}
          entries={this.state.pages[page] ? this.state.pages[page].entries : []}
          filters={childFilters}
          pageSize={pageSize}
          isLoading={this.getPageStatus(page) !== 'fetched'}
          onPageChange={this.onPageChange}
          onPageSizeChange={this.onPageSizeChange}
          onFilterChange={this.onFilterChange}
          count={this.state.count}
          selectedPage={page}
        />
      );
    }
  }

  return ListViewWrapper;
}
