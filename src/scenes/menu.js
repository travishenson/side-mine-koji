import Phaser from 'phaser';
import { TEXT } from '../config';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';

import { Background, HeadingText, Button, SoundControl } from '../uiComponents';

export default class Menu extends Phaser.Scene {
  constructor () {
    super({
      key: 'menu'
    });
  }

  create () {
    this.children.add(new Background(this, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2));

    // Add game title
    this.children.add(new HeadingText(
      this,
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 6,
      TEXT.GAME_TITLE.string,
      TEXT.GAME_TITLE.fontSize,
      TEXT.GAME_TITLE.color
    ));

    // Add UI elements
    this.children.add(new SoundControl(this, this.game.sound.mute));

    this.children.add(new Button(
      this,
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 1.5,
      'PLAY',
      true,
      () => {
        this.scene.start('tutorial', { mute: this.game.sound.mute });
      }
    ));
  }
}
