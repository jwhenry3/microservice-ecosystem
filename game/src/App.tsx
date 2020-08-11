import React, {  ReactNode,   useLayoutEffect, useState } from 'react';
import './App.css';
import {  getComponents, updateComponents } from './ui-components';
import { isEqual }                                     from 'lodash';

let components = getComponents();
const App = () => {
  const [componentList, setComponentList] = useState<{ [key: string]: ReactNode }>(components);
  useLayoutEffect(() => {
    let sub = updateComponents.subscribe(() => {
      let components = getComponents();
      if (!isEqual(components, componentList)) {
        console.log('update component list');
        setComponentList({ ...components });
      }
    });
    return () => sub.unsubscribe();
  }, [componentList, setComponentList]);

  return <>{Object.keys(componentList).map(key => componentList[key])}</>;
};

export default App;
