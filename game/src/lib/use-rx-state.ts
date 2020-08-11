import { useLayoutEffect, useState }        from 'react';
import { dispatch, select, selectSnapshot } from '@jwhenry/rx-state';
import { distinctUntilChanged, map }        from 'rxjs/operators';

export function useRxState<T, R = T>(key: string, mapper?: (model: T) => R, deps?: any[]) {

  const [state, setState] = useState<R>(mapper ? mapper(selectSnapshot(key)) : selectSnapshot(key));

  useLayoutEffect(() => {
    let subscription = select<T>(key)
      .pipe(map(data => (mapper ? mapper(data) : data) as R))
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(data => {
        if (JSON.stringify(data) !== JSON.stringify(state)) {
          setState(data as R);
        }
      });

    return () => subscription.unsubscribe();
  }, [state, key, mapper].concat(deps || []));

  return {
    state,
    dispatch: dispatch,
  };
}
