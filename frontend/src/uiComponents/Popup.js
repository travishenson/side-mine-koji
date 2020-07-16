import {IMAGES, TEXT} from '../config';
import { SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';


export class Popup extends Phaser.GameObjects.Image {
  constructor(scene, popupHeader, callback = () => {}) {
    super(scene, popupHeader);

    this.callback = callback;

    // Add basic data to popup including texture, size, and position
    this.setTexture(IMAGES.POPUP.key);
    this.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    this.setScale(0.01);
    this.setOrigin(0.5);

    // Add interactive functionality
    this.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { 
        this.popupText.destroy()
        this.continueText.destroy()
        this.destroy()
        this.callback()
      })

    scene.add.existing(this);

    // Add text to the popup
    this.popupText = scene.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, popupHeader, {
        wordWrap: {
            width: this.width
        }
    });
    this.popupText.setFontFamily(TEXT.HEADING.fontFamily);
    this.popupText.setFontSize('82px');
    this.popupText.setScale(0.01);
    this.popupText.setOrigin(0.5, 0.9);

    // Add tween for popup animation
    scene.tweens.add({
      targets: [this, this.popupText],
      ease: 'Back.Out',
      scale: 1,
      duration: 750
    })

    // Add a click to continue notification 
    setTimeout(() => {
      this.continueText = scene.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 100 , 'Click to continue...', {
        align: 'center',
        fontFamily: TEXT.HEADING.fontFamily,
        fontSize: '36px',
        wordWrap: {
          width: this.width
        }
      })
        .setScale(0.01)
        .setOrigin(0.5)

      scene.tweens.add({
        targets: this.continueText,
        ease: 'Back.Out',
        scale: 1,
        duration: 750
      })
    }, 1750)
  }
}