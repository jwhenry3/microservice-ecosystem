import { ReactNode, ReactNodeArray } from 'react';
import { Subject }                   from 'rxjs';

const components: { [key: string]: ReactNode } = {};
let updated: { [key: string]: ReactNode }      = {};

export const addComponent    = (key: string, component: ReactNode) => {
  components[key] = component;
  updated         = { ...components };
  Object.freeze(updated);
  updateComponents.next();
};
export const removeComponent = (key: string) => {
  delete components[key];
  updated = { ...components };
  Object.freeze(updated);
  updateComponents.next();
};

export const getComponents = () => (updated);

export const updateComponents = new Subject();
