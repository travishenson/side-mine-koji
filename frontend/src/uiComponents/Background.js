import {IMAGES} from '../config';
import { BASE_TEXT_SIZE, SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';
import Koji from '@withkoji/vcc';

export class Background extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y)

    this.setDepth(-1)
    this.setTexture(IMAGES.BACKGROUND.key);
    this.setPosition(x, y);

    let scaleX =  SCREEN_WIDTH / this.width;
    let scaleY = SCREEN_HEIGHT / this.height;
    let scale = Math.max(scaleX, scaleY);
    this.setScale(scale);

    scene.cameras.main.setBackgroundColor(Koji.config.colors.background);

    scene.add.existing(this);
  }
}