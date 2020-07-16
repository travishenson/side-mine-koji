import Phaser from 'phaser';
import { Background, SoundControl } from '../uiComponents';
import { BASE_TEXT_SIZE, SUBMIT, SCALE, SCREEN_WIDTH, SCREEN_HEIGHT, TITLE} from '../services/responsiveCalculator.js';

import Koji from '@withkoji/vcc';

const COLOR_PRIMARY = Koji.config.colors.submitScorePopup.replace('#', '0x');
const COLOR_LIGHT = Koji.config.colors.submitScoreField.replace('#', '0x');
const COLOR_DARK = 0x260e04;

export default class SubmitScore extends Phaser.Scene {
  constructor() {
    super({
      key: 'submitScore'
    })
  }

  init(data) {
    this.score = data.score || 0;
    this.mute = data.mute;
  }

  create() {
    // Add background
    this.children.add(new Background(this, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2));
    
    // Add UI elements
    this.children.add(new SoundControl(this, this.game.sound.mute));

    let isFetching = false;

    let submitDialog = CreateSubmitDialog(this, {
        x: SUBMIT.x,
        y: SUBMIT.y,
        title: 'Submit your score',
        username: 'Enter username',
        email: 'Enter email',
        optIn: false,
        score: this.score,
        width: Math.min(500, (SCREEN_WIDTH * 0.95)),
        height: SCREEN_HEIGHT * 0.95
    })
    .on('submit', (formData) => {
        if (isFetching) {
        return;
      }

      const body = {
        name: formData.username,
        score: this.score,
        privateAttributes: {
          email: formData.email,
          optIn: formData.optIn
        }
      }

      isFetching = true;

      fetch(`${Koji.config.serviceMap.backend}/leaderboard/save`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(response => response.json())
      .then((jsonResponse) => {
        this.scene.start('leaderboard', { mute: this.game.sound.mute, button: 'replay' })
      })
      .catch(err => {
        isFetching = false;
        console.log(err)
      })
    })
  }
}

const GetValue = Phaser.Utils.Objects.GetValue;
let CreateSubmitDialog = function(scene, config) {
  let username = GetValue(config, 'username', '');
  let email = GetValue(config, 'email', '');
  let optIn = GetValue(config, 'optIn', false);
  let title = GetValue(config, 'title', 'Welcome');
  let score = GetValue(config, 'score', 0);
  let x = GetValue(config, 'x', 0);
  let y = GetValue(config, 'y', 0);
  let width = GetValue(config, 'width', undefined);
  let height = GetValue(config, 'height', undefined);

  // Background object
  let background = scene.rexUI.add.roundRectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 0, 0, 10, COLOR_PRIMARY);

  // Title field object
  let titleField = scene.add.text(0, 0, title, {fontSize: BASE_TEXT_SIZE * SCALE});
  titleField.setPadding(0, 15, 0, 15);

  // Score field object
  let scoreField = scene.add.text(0, 0, score, {fontSize: BASE_TEXT_SIZE * 2 * SCALE});
  scoreField.setPadding(0, 20, 0, 20);
  
  // Username label
  let usernameLabel = scene.add.text(0, 0, 'Username:', {fontSize: BASE_TEXT_SIZE * SCALE});

  // User name field object
  let userNameField = scene.rexUI.add.label({
    orientation: 'x',
    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_LIGHT),
    text: scene.rexUI.add.BBCodeText(0, 0, username, {valign: 'center', fontSize: SUBMIT.fontSize}).setPadding(10, 0, 10, 0),
    space: {top: 5, bottom: 5, left: 0, right: 0},
    expandTextWidth: true,
  })
      .setInteractive()
      .on('pointerdown', function() {
        let config = {
          onTextChanged: function(textObject, text) {
            username = text;
            textObject.text = text;
          },
        };
        scene.rexUI.edit(userNameField.getElement('text'), config);
      });

  // Email label
  let emailLabel = scene.add.text(0, 0, 'Email:', {fontSize: BASE_TEXT_SIZE * SCALE});

  // Email field object
  let emailField = scene.rexUI.add.label({
    orientation: 'x',
    background: scene.rexUI.add.roundRectangle(0, 0, 0, 20, 0, COLOR_LIGHT),
    text: scene.rexUI.add.BBCodeText(0, 0, email, {valign: 'center', fontSize: SUBMIT.fontSize}).setPadding(10, 0, 10, 0),
    space: {top: 5, bottom: 5, left: 0, right: 0},
    expandTextWidth: true,
  })
      .setInteractive()
      .on('pointerdown', function() {
        let config = {
          onTextChanged: function(textObject, text) {
            email = text;
            textObject.text = text;
          },
        };
        scene.rexUI.edit(emailField.getElement('text'), config);
      });
  
  // Opt in radio button
  let optInField = scene.rexUI.add.buttons({
      orientation: 'y',
      buttons: [
        createButton(scene, 'Keep me updated')
      ],
      type: 'checkboxes',
      setValueCallback: function (button, value) {
        button.value = value;
        optIn = value;
        button.getElement('icon')
        .setFillStyle((value)? COLOR_LIGHT : undefined);
      }
    });

  // Submit button object
  let submitButton = scene.rexUI.add.label({
    orientation: 'x',
    background: scene.rexUI.add.roundRectangle(0, 0, 10, 0, 10, COLOR_LIGHT),
    text: scene.add.text(0, 0, 'Submit', {fontSize: BASE_TEXT_SIZE * 1.25 * SCALE}).setPadding(15, 5, 15, 5)
  })
      .setInteractive()
      .on('pointerdown', function() {
        submitDialog.emit('submit', {username, email, optIn, score});
      });

  // Dialog and its children
  let submitDialog = scene.rexUI.add.sizer({
    orientation: 'y',
    x: x,
    y: y,
    width: width,
    height: height,
  })
      .addBackground(background)
      .add(titleField, 0, 'center', {}, false)
      .add(scoreField, 0, 'center', {}, false)
      .add(usernameLabel, 0, 'left', {left: 15}, false)
      .add(userNameField, 0, 'left', {top: 10, right: 15, bottom: 50, left: 15}, true)
      .add(emailLabel, 0, 'left', {left: 15}, false)
      .add(emailField, 0, 'left', {top: 10, right: 15, bottom: 25, left: 15}, true)
      .add(optInField, 0, 'left', {}, false)
      .add(submitButton, 0, 'center', {top: 15, right: 15, bottom: 50, left: 15}, false)
      .layout();

  return submitDialog;
};

let createButton = function (scene, text, name) {
    if (name === undefined) {
        name = text;
    }

    var button = scene.rexUI.add.label({
        width: 100,
        height: 40,
        text: scene.add.text(0, 0, text, {
            fontSize: BASE_TEXT_SIZE * SCALE
        }),
        icon: scene.add.circle(0, 0, 10).setStrokeStyle(1, COLOR_DARK),
        space: {
            left: 15,
            right: 10,
            icon: 10
        },

        name: name
    });

    return button;
}