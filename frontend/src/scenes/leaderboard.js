import Phaser from 'phaser';
import Koji from '@withkoji/vcc';

import { Background, Button, SoundControl } from '../uiComponents';
import { BASE_TEXT_SIZE, LEADERBOARD, SCREEN_HEIGHT, SCREEN_WIDTH, SCALE, SUBMIT, TITLE} from '../services/responsiveCalculator.js';

const COLOR_PRIMARY = Koji.config.colors.submitScorePopup.replace('#', '0x');
const COLOR_LIGHT = Koji.config.colors.submitScoreField.replace('#', '0x');
const COLOR_DARK = 0x260e04;

export default class Leaderboard extends Phaser.Scene {
  constructor() {
    super({
      key: 'leaderboard'
    })
  }

  init(data) {
      this.data = data
  }
  
  create() {
      // Add background
    this.children.add(new Background(this, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2));
    
    fetch(`${Koji.config.serviceMap.backend}/leaderboard`)
        .then((response) => response.json())
        .then(({scores}) => {
          console.log(scores)
          this.gridTable.setItems(scores);
        })
        .catch((err) => {
          console.log('Fetch Error: ', err);
        });

    let scrollMode = 0; // 0:vertical, 1:horizontal
    this.gridTable = this.rexUI.add.gridTable({
      x: LEADERBOARD.x,
      y: LEADERBOARD.y,
      width: Math.min(500, (SCREEN_WIDTH * 0.95)),
      height: SCREEN_HEIGHT * 0.95,

      scrollMode: scrollMode,

      background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

      table: {
        cellWidth: (scrollMode === 0) ? undefined : 30 * SCALE,
        cellHeight: (scrollMode === 0) ? 30 * SCALE : undefined,

        columns: 1,

        mask: {
          padding: 10,
        },

        reuseCellContainer: true,
      },

      slider: {
        track: this.rexUI.add.roundRectangle(0, 0, 20 * SCALE, 10, 10, COLOR_DARK),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13 * SCALE, COLOR_LIGHT),
      },

      header: this.rexUI.add.label({
        width: (scrollMode === 0) ? undefined : 0,
        height: (scrollMode === 0) ? 0 : undefined,

        orientation: scrollMode,
        background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),
        text: this.add.text(0, 0, ' Leaderboard', {fontSize: BASE_TEXT_SIZE * SCALE}),
      }),

      space: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10,

        table: 10,
        header: 10,
        footer: 10,
      },

      createCellContainerCallback: function(cell, cellContainer) {
        let scene = cell.scene;
        let width = cell.width;
        let height = cell.height;
        let item = cell.item;
        let index = cell.index;
        if (cellContainer === null) {
          cellContainer = scene.rexUI.add.label({
            width: width,
            height: height,

            orientation: scrollMode,
            background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
            text: scene.add.text(0, 0, '', {fontSize: LEADERBOARD.scores_fontSize}),

            space: {
              left: (scrollMode === 0) ? 15 : 0,
              top: (scrollMode === 0) ? 0 : 15,
            },
          });
          // console.log(cell.index + ': create new cell-container');
        } else {
          // console.log(cell.index + ': reuse cell-container');
        }

        // Set properties from item value
        cellContainer.setMinSize(width, height); // Size might changed in this demo
        cellContainer.getElement('text').setText(`${index+1}. ${item.score ? item.score : 0} - ${item.name}`); // Set text of text object
        return cellContainer;
      },
    })
        .layout();

    this.children.add(new Button(
      this, 
      SCREEN_WIDTH - (100 * SCALE * 0.75), 
      SCREEN_HEIGHT - (50 * SCALE * 0.75),
      this.data.button === 'menu' ? 'MENU' : 'REPLAY', 
      () => {
        this.data.button === 'menu' ?
        this.scene.start('menu', { mute: this.game.sound.mute }) :
        this.scene.start('play', { mute: this.game.sound.mute }) 
      }  
    ));

    // Add UI elements
    this.children.add(new SoundControl(this, this.game.sound.mute));
  }

}