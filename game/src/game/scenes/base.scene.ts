export abstract class BaseScene extends Phaser.Scene {


  init() {
    this.events.on('stop', () => this.stop ? this.stop() : null);
    this.events.on('resume', () => {
      this.resume();
      this.start();
    });
  }

  create() {
    this.start();
  }

  abstract stop(): void;

  abstract start(): void;

  abstract resume(): void;
}
