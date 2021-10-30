import Phaser from 'phaser/src/phaser';
import { IMAGES, TEXT } from '../config';
import { BASE_TEXT_SIZE, SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';

export class TutorialPopup extends Phaser.GameObjects.Image {
  constructor (scene, tutorialHeader, tutorialBody, callback = () => {}) {
    super(scene, tutorialHeader, tutorialBody);

    this.callback = callback;

    // Add basic data to popup including texture, size, and position
    this.setTexture(IMAGES.POPUP.key);
    this.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    this.setScale(0.01);
    this.setOrigin(0.5);

    // Add interactive functionality
    this.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.headerText.destroy();
        this.bodyText.destroy();
        this.continueText.destroy();
        this.destroy();
        this.callback();
      });

    scene.add.existing(this);

    // Add text to the popup
    this.headerText = scene.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, tutorialHeader, {
      wordWrap: {
        width: this.width
      }
    });
    this.headerText.setFontFamily(TEXT.BODY.fontFamily);
    this.headerText.setFontSize(BASE_TEXT_SIZE);
    this.headerText.setOrigin(0.5, 0.9);

    this.bodyText = scene.add.text(SCREEN_WIDTH / 2, (SCREEN_HEIGHT / 2) + 100, tutorialBody, {
      wordWrap: {
        width: this.width
      }
    });
    this.bodyText.setFontFamily(TEXT.BODY.fontFamily);
    this.bodyText.setFontSize(BASE_TEXT_SIZE);
    this.bodyText.setOrigin(0.5, 0.9);
    this.bodyText.setLineSpacing(-100);

    // Add a click to continue notification
    setTimeout(() => {
      this.continueText = scene.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 100, 'Click to continue...', {
        align: 'center',
        fontFamily: TEXT.BODY.fontFamily,
        fontSize: BASE_TEXT_SIZE,
        wordWrap: {
          width: this.width
        }
      })
        .setOrigin(0.5);

      scene.tweens.add({
        targets: this.continueText,
        ease: 'Back.Out',
        scale: SCALE * 0.75,
        duration: 750
      });
    }, 1750);
  }
}
