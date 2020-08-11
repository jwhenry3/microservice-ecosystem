import { useEffect, useState }  from 'react';
import { BehaviorSubject }      from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const Observe = (props: { children: any, state: BehaviorSubject<any> }) => {
  const [state, setState] = useState(props.state?.getValue() || {});
  useEffect(() => {
    let subscription = props.state.pipe(distinctUntilChanged())
                            .subscribe((value) => {
                              setState(value);
                            });
    return () => subscription.unsubscribe();
  }, [props.state]);

  return props.children(state);
};

export default Observe;
