import { ReactNode } from 'react';
import { Subject }   from 'rxjs';

const components: { [key: string]: ReactNode } = {};
let updated: { [key: string]: ReactNode }      = {};

export const setComponent    = (key: string, component: ReactNode) => {
  components[key] = component;
  updated         = { ...components };
  Object.freeze(updated);
  if (!displayOrder.includes(key)) {
    displayOrder.push(key);
  } else {
    focusComponent(key);
  }
  updateComponents.next();
};
export const removeComponent = (key: string) => {
  delete components[key];
  updated = { ...components };
  Object.freeze(updated);
  if (displayOrder.includes(key)) {
    displayOrder.splice(displayOrder.indexOf(key), 1);
  }
  updateComponents.next();
};

export function focusComponent(key: string) {
  if (displayOrder.includes(key)) {
    displayOrder.splice(displayOrder.indexOf(key), 1);
    displayOrder.push(key);
    console.log(displayOrder);
    updateComponents.next();
  }
}

export const getComponents = () => (updated);

export const updateComponents = new Subject();


export const displayOrder: string[] = [];
