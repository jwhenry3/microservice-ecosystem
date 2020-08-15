export class InteractionArea {
  x: number               = null;
  y: number               = null;
  interactionArea: number = 0;
  interactionLimits       = {
    left : 0,
    right: 0,
    up   : 0,
    down : 0,
  };

  constructor() {
  }

  setupInteractionArea(margin = 0, x = 0, y = 0) {
    // interaction area can be forced by parameter:
    if (margin) {
      this.interactionArea = margin;
    }
    // if there's none interaction area just do nothing:
    if (!this.interactionArea) {
      return;
    }
    if (x) {
      this.x = x;
    }
    if (y) {
      this.y = y;
    }
    this.interactionLimits.left  = this.x - this.interactionArea;
    this.interactionLimits.right = this.x + this.interactionArea;
    this.interactionLimits.up    = this.y - this.interactionArea;
    this.interactionLimits.down  = this.y + this.interactionArea;
  }

  isValidInteraction(posX, posY) {
    return posX > this.interactionLimits.left
      && posX < this.interactionLimits.right
      && posY > this.interactionLimits.up
      && posY < this.interactionLimits.down;
  }

}
