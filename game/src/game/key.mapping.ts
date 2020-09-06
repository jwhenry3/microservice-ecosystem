export const availableKeys = '1234567890-=qwertyuiop[]asdfghjkl;\'zxcvbnm,. '.split('');
export const keyLabels     = {
  ' ': 'Spacebar',
};

export class KeyMapping {
  map: { [key: string]: string } = {};

  setMapping(key: string, action: string) {
    this.map[key] = action;
  }

  getMapping(key: string) {
    return this.map[key];
  }

  unsetMapping(key: string) {
    delete this.map[key];
  }

  getMappings() {
    return availableKeys.map(key => ({ [keyLabels[key] || key]: this.map[key] }));
  }
}
