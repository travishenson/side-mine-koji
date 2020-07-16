import { SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';

export class SoundControl extends Phaser.GameObjects.Image {
  constructor(scene, muteBoolean) {
    super(scene, muteBoolean);

    this.setTexture(muteBoolean ? 'mute' : 'volume');
    this.setPosition(50 * SCALE, SCREEN_HEIGHT - (SCALE * 50));
    this.setInteractive({useHandCursor: true})
    .on('pointerdown', () => { 
      if (this.texture.key === 'volume') {
        this.setTexture('mute');
        scene.game.sound.mute = true;
      } else {
        this.setTexture('volume');
        scene.game.sound.mute = false;
      }
    })

    this.setScale(SCALE * 0.5)
  }
}