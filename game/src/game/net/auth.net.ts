import { Net } from './net';

export class AuthNet {

  session = {
    email: '',
    token: '',
  };

  constructor(private net: Net) {
  }

  login(email: string, password: string) {
    return this.net.request<{ token: string }>('account.login', { email, password });
  }

  logout() {
    return this.net.request<{ token: string }>('account.logout', {});
  }

  register(email: string, password: string) {
    return this.net.request<{ token: string }>('account.register', { email, password });
  }

  verify() {
    return this.net.request('account.verify', { token: this.session.token });
  }

  onLoggedIn(cb: (data: any) => void) {
    this.net.on('account.logged-in', cb);
  }

  onLoggedOut(cb: (data: any) => void) {
    this.net.on('account.logged-out', cb);
  }
}
