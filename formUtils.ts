import * as React from 'react';

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export const handleInputChange = (event: InputChangeEvent): any => {
  const target = event.target;
  const value = target.type === 'checkbox' ? (target as any).checked : target.value;
  return { [target.name]: value };
};
