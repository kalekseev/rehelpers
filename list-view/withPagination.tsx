import * as React from 'react';
import range from 'lodash-es/range';

interface Props {
  count: number;
  pageSize: number;
  page: number;
  onChange: (page: number) => any;
}

interface Entry {
  key: string;
  onClick: (e: React.MouseEvent<any>) => void;
  active: boolean;
  disabled: boolean;
  label: string | null;
}

export interface PaginatorInterface {
  previous: { disabled: boolean; onClick: (e: React.MouseEvent<any>) => void };
  next: { disabled: boolean; onClick: (e: React.MouseEvent<any>) => void };
  entries: Entry[];
}

export function withPagination(Wrapped: React.ComponentType<PaginatorInterface>) {
  class Paginator extends React.Component<Props> {
    onChange = (page: number) => {
      return (e: React.MouseEvent<any>) => {
        e.preventDefault();
        if (page === this.props.page) {
          return;
        }
        this.props.onChange(page);
      };
    };

    render() {
      const { page, pageSize, count, onChange, ...rest } = this.props;
      const prevPage = this.props.page - 1;
      const nextPage = this.props.page + 1;
      const totalPages = Math.ceil(count / pageSize);
      if (totalPages < 2) {
        return null;
      }
      let pages: Array<number | null>;
      if (totalPages < 6) {
        pages = range(1, totalPages + 1);
      } else if (page < 4) {
        pages = [1, 2, 3, null, totalPages];
      } else if (page > totalPages - 3) {
        pages = [1, null, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, null, page, null, totalPages];
      }
      const entries = pages.map((p, i) => {
        const key = p === null ? `${i}---` : String(p);
        const handleClick = p === null ? () => null : this.onChange(p as any);
        return {
          key,
          onClick: handleClick,
          active: page === p,
          disabled: p === null,
          label: p === null ? null : String(p),
        };
      });
      const props = {
        previous: { disabled: prevPage < 1, onClick: this.onChange(prevPage) },
        next: { disabled: nextPage * pageSize > count + pageSize, onClick: this.onChange(nextPage) },
        entries,
      };
      return <Wrapped {...rest} {...props} />;
    }
  }
  return Paginator;
}
