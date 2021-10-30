import Phaser from 'phaser';
import { IMAGES, TEXT } from '../config';
import { SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';

export class Button extends Phaser.GameObjects.Image {
  constructor (scene, x, y, label, menuButton, callback = () => {}) {
    super(scene, x, y, label, menuButton);

    this.callback = callback;

    this.setTexture(IMAGES.BUTTON.key);
    this.setPosition(x, y);
    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => { this.setTexture(IMAGES.BUTTON_HOVER.key); })
      .on('pointerout', () => { this.setTexture(IMAGES.BUTTON.key); })
      .on('pointerdown', this.callback);

    this.setOrigin(0.5, 0.5);
    if (menuButton === true) {
      this.setScale(SCALE * 0.5);
    } else {
      this.setScale(SCALE * 0.35);
    }
    scene.add.existing(this);

    scene.add.text(x, y, label)
      .setOrigin(0.5, 0.58)
      .setPosition(x, y)
      .setFontFamily(TEXT.HEADING.fontFamily)
      .setFontSize(TEXT.BUTTON.fontSize)
      .setFill(TEXT.BUTTON.color);
  }
}
