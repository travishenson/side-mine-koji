import {IMAGES, SCREEN_WIDTH, SCREEN_HEIGHT} from '../config';
import Play from '../scenes/play';

let target;

export class Projectile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, pointer) {
    super(scene, x, y, pointer);
    this.play = new Play();

    this.setTexture(IMAGES.PROJECTILE.key);
    this.setPosition(x, y);

    // Scale sprite for projectile
    let widthHeightRatio = this.width / this.height;
    this.displayWidth = 64;
    this.displayHeight = this.displayWidth / widthHeightRatio;

    scene.physics.add.existing(this);

    // Add cursor click as target for projectile
    target = new Phaser.Math.Vector2();
    target.x = pointer.x;
    target.y = pointer.y;
    scene.physics.moveToObject(this, target, SCREEN_WIDTH * 2.0);

    this.enableBody = true;
    this.body.setAllowGravity(false);
  }

  update() {
    if (this.x > target.x) {
      this.destroy();
    }
  }
}