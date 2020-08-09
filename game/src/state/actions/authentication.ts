import { SocketClient }        from '../../connection/socketClient';
import { loggedIn, loggedOut } from '../ui.state';

export const verifyToken = () => (dispatch, getState): Promise<boolean> => {
  return new Promise(resolve => {
    let state = getState().ui;
    SocketClient.socket.emit('request', {
      event: 'account.verify',
      data : { token: state.token },
    }, (result) => {
      if (!result?.id) {
        dispatch(loggedOut({}));
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
export const login       = (email: string, password: string) => (dispatch): Promise<boolean> => {
  return new Promise(resolve => {
    SocketClient.socket.emit('request', {
      event: 'account.login',
      data : { email, password },
    }, (result) => {
      if (result && result.token) {
        dispatch(loggedIn({ token: result.token, email }));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
export const register    = (email: string, password: string) => (dispatch) => {
  return new Promise(resolve => {
    SocketClient.socket.emit('request', {
      event: 'account.register',
      data : { email, password },
    }, (result) => {
      if (result && result.token) {
        dispatch(loggedIn({ token: result.token, email }));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
