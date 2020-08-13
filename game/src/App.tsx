import React, { ReactNode, useLayoutEffect, useState }   from 'react';
import './App.css';
import { displayOrder, getComponents, updateComponents } from './ui-components';
import { isEqual }                                       from 'lodash';

const App = () => {
  const [componentList, setComponentList] = useState<string[]>([]);
  useLayoutEffect(() => {
    let sub = updateComponents.subscribe(() => {
      if (JSON.stringify(displayOrder) !== JSON.stringify(componentList)) {
        setComponentList([...displayOrder]);
      }
    });
    return () => sub.unsubscribe();
  }, [componentList, setComponentList]);

  let components = getComponents();
  return <>{componentList.map((key: string) => components[key])}</>;
};

export default App;
