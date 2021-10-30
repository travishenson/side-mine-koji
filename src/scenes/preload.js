import Phaser from 'phaser';
// import { PHASER_CONFIG } from '../../src/index';
import { SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';

import { LoadingScreen } from '../uiComponents/LoadingScreen';

// Images
import backgroundImg from '../assets/background.png';
import ground from '../assets/sandblock.png';
import island from '../assets/island.png';
import ship from '../assets/ship.png';

// Tiles
import blueGem from '../assets/gems/blue-gem.png';
import greenGem from '../assets/gems/green-gem.png';
import greyGem from '../assets/gems/grey-gem.png';
import redGem from '../assets/gems/red-gem.png';
import explosion from '../assets/gems/explosion.png';

export const gemsArray = [
  {image: 'https://images.koji-cdn.com/d8f7153b-775a-441b-a1cc-a3a364e41c17/zd4f4-bluegem.png?w=64&h=64', value: 5},
  {image: 'https://images.koji-cdn.com/d8f7153b-775a-441b-a1cc-a3a364e41c17/wfpin-redgem.png?w=64&h=64', value: 10},
  {image: 'https://images.koji-cdn.com/d8f7153b-775a-441b-a1cc-a3a364e41c17/63dne-greengem.png?w=64&h=64', value: 15},
  {image: 'https://images.koji-cdn.com/d8f7153b-775a-441b-a1cc-a3a364e41c17/ljdad-greygem.png?w=64&h=64', value: 20}
];

// Player
import playerIdle from '../assets/pirate/playerIdle.png';
import playerThrow from '../assets/pirate/playerThrow.png';
import sword from '../assets/pirate/sword.png';

// UI
import button from '../assets/ui/button.png';
import buttonHover from '../assets/ui/button-hover.png';
import volume from '../assets/ui/volume.png';
import volumeMute from '../assets/ui/mute.png';
import popup from '../assets/ui/large-board.png';

// Music & Sounds
import theme from '../assets/sound/banana_tree.mp3';
import swoosh from '../assets/sound/bamboo_swoosh.mp3';
import thud from '../assets/sound/thud.mp3';
import scrape from '../assets/sound/brick_scrape.mp3';

export default class Preload extends Phaser.Scene {
  constructor () {
    super({
      key: 'preload'
    });
  }

  preload () {
    this.load.scenePlugin(
      'rexuiplugin', 
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 
      'rexUI', 
      'rexUI'
    );

    // Loading screen
    this.children.add(new LoadingScreen(this));

    // LOAD IN-GAME ASSETS

    // UI elements
    this.load.image('button', `${button}?w=${380 * SCALE}&h=${140 * SCALE}&fit=bounds`);
    this.load.image('buttonHover', `${buttonHover}?w=${380 * SCALE}&h=${140 * SCALE}&fit=bounds`);
    this.load.image('volume', `${volume}?w=${90 * SCALE}&h=${85 * SCALE}&fit=bounds`);
    this.load.image('mute', `${volumeMute}?w=${90 * SCALE}&h=${85 * SCALE}&fit=bounds`);
    this.load.image('popup', `${popup}?w=${865}&h=${553}&fit=bounds`);

    // Audio
    this.load.audio('theme', theme);
    this.load.audio('throw', swoosh);
    this.load.audio('thud', thud);
    this.load.audio('scrape', scrape);

    // Background image
    this.load.image('background', `${backgroundImg}?w=${SCREEN_WIDTH}&h=${SCREEN_HEIGHT}&fit=cover`);

    // World elements
    this.load.image('ground', `${ground}?w=${128}&h=${384}&fit=bounds`);

    // Player sprites
    this.load.image('playerIdle', `https://images.koji-cdn.com/d8f7153b-775a-441b-a1cc-a3a364e41c17/lrbzf-playerIdle.png?w=${833 * SCALE * 0.15}&h=${1290 * SCALE * 0.15}&fit=bounds`);
    this.load.image('playerThrow', `https://images.koji-cdn.com/d8f7153b-775a-441b-a1cc-a3a364e41c17/duzcp-playerThrow.png?w=${939 * SCALE * 0.15}&h=${1290 * SCALE * 0.15}&fit=bounds`);

    // Projectile
    this.load.image('projectile', `${sword}?w=${64 * SCALE}&h=${130 * SCALE}&fit=bounds`);

    // Tile sprites
    for (let i = 0; i < gemsArray.length; i++) {
      this.load.image('gem' + i, gemsArray[i].image);
    }
    this.load.image('tileExplosion', `${explosion}?w=${176}&h=${169}&fit=bounds`);
  }

  create () {
    this.game.themeMusic = this.sound.add('theme', 1, true);
    this.game.themeMusic.play();
    this.game.themeMusic.setLoop(true);
  }

  update () {
    this.scene.start('menu');
  }
}
