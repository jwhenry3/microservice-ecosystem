export const availableKeys = '1234567890-=qwertyuiop[]asdfghjkl;\'zxcvbnm,. '.split('');
export const keyLabels     = {
  ' ': 'Spacebar',
};

export class KeyMapping {
  keys: { [key: string]: string } = {};

  set(key: string, action: string) {
    this.keys[key] = action;
  }

  get(key: string) {
    return this.keys[key];
  }

  unset(key: string) {
    delete this.keys[key];
  }

  getMappings() {
    return availableKeys.map(key => ({ [keyLabels[key] || key]: this.keys[key] }));
  }
}
