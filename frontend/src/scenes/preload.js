import Phaser from 'phaser';
import phaserConfig from '../config/phaser.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';
import Koji from '@withkoji/vcc';

import { LoadingScreen } from '../uiComponents/LoadingScreen';

export default class Preload extends Phaser.Scene {
  constructor() {
    super({
      key: 'preload'
    })
  }

  preload() {
    this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    // Loading screen
    this.children.add(new LoadingScreen(this));

    // LOAD IN-GAME ASSETS
    
    // UI elements
    this.load.image('button', `${Koji.config.images.button}?w=${380 * SCALE}&h=${140 * SCALE}&fit=bounds`);
    this.load.image('buttonHover', `${Koji.config.images.buttonHover}?w=${380 * SCALE}&h=${140 * SCALE}&fit=bounds`);
    this.load.image('volume', `${Koji.config.images.volume}?w=${90 * SCALE}&h=${85 * SCALE}&fit=bounds`);
    this.load.image('mute', `${Koji.config.images.volumeMute}?w=${90 * SCALE}&h=${85 * SCALE}&fit=bounds`);
    this.load.image('popup', `${Koji.config.images.popup}?w=${865}&h=${553}&fit=bounds`);

    // Audio
    this.load.audio('theme', Koji.config.sounds.backgroundMusic);
    this.load.audio('throw', Koji.config.sounds.throw);
    this.load.audio('thud', Koji.config.sounds.thud);
    this.load.audio('scrape', Koji.config.sounds.shift);

    // Background image
    this.load.image('background', `${Koji.config.images.background}?w=${SCREEN_WIDTH}&h=${SCREEN_HEIGHT}&fit=cover`);

    // Logo
    if (Koji.config.images.logo) {
      this.load.image('logo', `${Koji.config.images.logo}?w=${SCREEN_WIDTH / 2}&fit=bounds`);
    }

    // World elements
    this.load.image('ground', `${Koji.config.images.ground}?w=${128}&h=${384}&fit=bounds`);

    // Player sprites
    this.load.image('playerIdle', `${Koji.config.player.playerIdle}?w=${833 * SCALE * 0.15}&h=${1290 * SCALE * 0.15}&fit=bounds`);
    this.load.image('playerThrow', `${Koji.config.player.playerThrow}?w=${939 * SCALE * 0.15}&h=${1290 * SCALE * 0.15}&fit=bounds`);

    // Projectile
    this.load.image('projectile', `${Koji.config.images.projectile}?w=${64 * SCALE}&h=${130 * SCALE}&fit=bounds`);

    // Tile sprites
    for (let i = 0; i < Koji.config.tiles.tiles.length; i++) {
      this.load.image('gem' + i, `${Koji.config.tiles.tiles[i].image}?w=${64}&h=${64}`)
    };
    this.load.image('tileExplosion', `${Koji.config.images.tileExplosion}?w=${176}&h=${169}&fit=bounds`);
  }

  create() {
    this.game.themeMusic = this.sound.add('theme', 1, true);
    this.game.themeMusic.play();
    this.game.themeMusic.setLoop(true);
  }

  update() {
    this.scene.start('menu');
  }
};
