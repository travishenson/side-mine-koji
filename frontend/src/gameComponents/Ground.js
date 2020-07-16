import {IMAGES} from '../config';
import { SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';

export class Ground extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y)

    // Size and positioning of ground
    this.setTexture(IMAGES.GROUND.key);

    // this.setScale(SCALE * 0.5);
    // this.displayWidth = SCREEN_WIDTH;
    this.displayHeight = 384;

    scene.physics.add.existing(this);

    // Physics of ground
    this.enableBody = true;
    this.body.collideWorldBounds = true;
    this.body.immovable = true;
    this.body.setAllowGravity(false);
  }
}