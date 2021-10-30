import Phaser from 'phaser/src/phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config';

export class LoadingScreen extends Phaser.GameObjects.Graphics {
  constructor (scene) {
    super(scene);

    let progressBar = scene.add.graphics();
    let progressBox = scene.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(SCREEN_WIDTH / 2 - 250, SCREEN_HEIGHT / 2, 500, 50);

    let loadingText = scene.make.text({
      x: SCREEN_WIDTH / 2,
      y: (SCREEN_HEIGHT / 2) - 25,
      text: 'Loading assets...',
      style: {
        font: '24px sans-serif',
        fill: '#FFFFFF'
      }
    }).setOrigin(0.5, 0.65);

    let percentText = scene.make.text({
      x: SCREEN_WIDTH / 2,
      y: SCREEN_HEIGHT / 2 + 25,
      text: '0%',
      style: {
        font: '18px sans-serif',
        fill: '#FFFFFF'
      }
    }).setOrigin(0.5, 0.65);

    scene.load.on('progress', (progress) => {
      percentText.setText(parseInt(progress * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(SCREEN_WIDTH / 2 - 240, SCREEN_HEIGHT / 2 + 10, 480 * progress, 30);
    });

    scene.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    scene.add.text(0, 0, 'hack', { font: '1px pirata', fill: '#FFFFFF' });
  }
}
