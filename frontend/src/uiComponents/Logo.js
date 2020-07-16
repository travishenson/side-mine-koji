import {IMAGES, SCREEN_WIDTH, SCREEN_HEIGHT} from '../config';
import Koji from '@withkoji/vcc';

export class Logo extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y)

    this.setDepth(-1)
    this.setTexture(IMAGES.LOGO.key);
    this.setPosition(x, y);

    let scaleX =  SCREEN_WIDTH / this.width;
    let scaleY = SCREEN_HEIGHT / this.height;
    let scale = Math.max(scaleX, scaleY);
    this.setScale(scale);

    scene.add.existing(this);
  }
}