import {PLAYER} from '../config';
import { SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y)

    // Size and positioning of player
    this.setTexture(PLAYER.INITIAL_SPRITE.key);
    this.setPosition(x, y);

    scene.physics.add.existing(this);

    // Physics of player
    this.enableBody = true;
    this.body.setSize(this.width, this.height - 75);
    this.body.collideWorldBounds = true;
    this.body.setAllowGravity(true);
  }
}