import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT, TEXT } from '../config';

export class HeadingText extends Phaser.GameObjects.Text {
  constructor (scene, x, y, text = '', fontSize, color, config) {
    super(scene, x, y, text, {
      fontFamily: TEXT.HEADING.fontFamily,
      fontSize: fontSize,
      color: color
    });

    this.setOrigin(0.5, 0.55);
    this.setWordWrapWidth(SCREEN_WIDTH);

    scene.add.existing(this);
  }
}
