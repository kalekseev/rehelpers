import * as React from 'react';

export const getDisplayName = (WrappedComponent: React.ComponentType) =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';
