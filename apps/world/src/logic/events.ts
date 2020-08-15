import { Subject } from 'rxjs';

export const eventSubject = new Subject();
export const WorldEvents  = {
  emit: (event: string, data, origin) => {
    eventSubject.next({
      event,
      data,
      origin,
    });
  },
};
