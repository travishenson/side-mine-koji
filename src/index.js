import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import Preload from './scenes/preload';
import Menu from './scenes/menu';
import Tutorial from './scenes/tutorial';
import Play from './scenes/play';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config/dimensions';

export const PHASER_CONFIG = {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.NONE,
    width: SCREEN_WIDTH, // set game width by multiplying canvas width with devicePixelRatio
    height: SCREEN_HEIGHT, // set game height by multiplying canvas height with devicePixelRatio
    zoom: 1 / window.devicePixelRatio
  },
  pixelArt: false,
  title: 'Pirate\'s Plunder',
  banner: { text: 'white', background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'] },
  scene: [Preload, Menu, Tutorial, Play],
  parent: 'phaser-container',
  dom: {
    createContainer: true
  },
  plugins: {
    scene: [{
      key: 'rexUI',
      plugin: RexUIPlugin,
      mapping: 'rexUI'
    }]
  }
};

export const game = new Phaser.Game(PHASER_CONFIG);
