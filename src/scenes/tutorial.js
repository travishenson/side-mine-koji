import Phaser from 'phaser';

import { BASE_TEXT_SIZE, SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';
import { Background, HeadingText, SoundControl } from '../uiComponents';

export default class Tutorial extends Phaser.Scene {
  constructor () {
    super({
      key: 'tutorial',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 500 },
          debug: false
        }
      }
    });
  }

  init (data) {
    this.mute = data.mute;
  }

  create () {
    // Basic game variables and trackers
    this.score = 0;
    this.scoreText = this.add.text(SCREEN_WIDTH - (25 * SCALE * 0.75), (50 * SCALE * 0.75), `Score: 0`, { fontSize: BASE_TEXT_SIZE * 1.5, fontFamily: 'sans-serif' });
    this.scoreText.setOrigin(1.0, 0.65);

    this.level = 0;
    this.shiftsCompleted = 0;
    this.shiftsNeeded = 5;
    this.levelText = this.add.text((25 * SCALE * 0.75), (50 * SCALE * 0.75), `Level ${this.level}: (${this.shiftsCompleted} / ${this.shiftsNeeded}) shifts`, { fontSize: BASE_TEXT_SIZE * 1.5, fontFamily: 'sans-serif' });
    this.levelText.setOrigin(0.0, 0.65);

    this.isShifting = false;
    this.canThrow = false;
    this.canShift = false;

    this.tileSprites = this.add.container();
    this.tutorialText = this.add.group();

    //  Background for the game
    this.children.add(new Background(this, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2));

    // Creating the ground for the base of the game
    this.ground = this.add.tileSprite(SCREEN_WIDTH / 2, SCREEN_HEIGHT, SCREEN_WIDTH, 384, 'ground');
    this.ground.height = 192;

    // Physics of ground
    this.physics.add.existing(this.ground);
    this.ground.enableBody = true;
    this.ground.body.collideWorldBounds = true;
    this.ground.body.immovable = true;
    this.ground.body.setAllowGravity(false);

    // Volume control
    this.children.add(new SoundControl(this, this.game.sound.mute));

    this.addIntro();
    this.input.on('pointerdown', this.continueClick, this);
  }

  // Adding popups for instruction

  // Intro popup
  addIntro () {
    this.overlay = this.add.renderTexture(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.overlay.fill(0x000000, 0.75);

    let introBodyText = [
      'Your goal is to clear out tiles by clicking on matching groups.',
      '',
      'A group is two or more tiles with the same color.',
      '',
      'Throughout the game, the tiles will automatically shift closer to your player, but you can also shift them yourself.',
      '',
      'Survive the specified number of shifts to advance!',
      ' ',
      'Give the controls a try with this Level 0 tutorial.'
    ];

    this.introHeading = new HeadingText(
      this,
      SCREEN_WIDTH / 2,
      100,
      'Welcome to Pirates Plunder',
      BASE_TEXT_SIZE * 2,
      '#FFF'
    );

    this.introBody = this.add.text(
      SCREEN_WIDTH / 2,
      (SCREEN_HEIGHT / 2),
      introBodyText
    )
      .setFontFamily('sans-serif')
      .setOrigin(0.5)
      .setFontSize(BASE_TEXT_SIZE)
      .setWordWrapWidth(Math.min(750, SCREEN_WIDTH * 0.9))
      .setAlign('center');

    this.introContinue = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 100,
      'Click to continue...'
    )
      .setFontFamily('pirata')
      .setFontSize(BASE_TEXT_SIZE * 1.5)
      .setWordWrapWidth(Math.min(750, SCREEN_WIDTH * 0.9))
      .setOrigin(0.5)
      .setAlign('center')
      .setLineSpacing(-200);

    this.tutorialText.addMultiple(this.introHeading);

    this.overlay.setInteractive({ useHandCursor: true });
  }

  continueClick () {
    this.introHeading.destroy();
    this.introBody.destroy();
    this.introContinue.destroy();
    this.overlay.destroy();

    this.scene.start('play', { mute: this.game.sound.mute });
  }
}
