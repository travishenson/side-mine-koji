import Phaser from 'phaser';
import { BASE_TEXT_SIZE, SCALE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../services/responsiveCalculator.js';
import { gemsArray } from './preload.js';

import { Background, Button, Popup, SoundControl } from '../uiComponents';
import { Match2, Player, Projectile } from '../gameComponents';

let tilesVisible = 2;
let baseTileSize = 64;
let scaledTileSize = baseTileSize * SCALE * 0.65;

let gameOptions = {
  tileSize: scaledTileSize,
  groundHeight: 192,
  boardOffset: {
    x: SCREEN_WIDTH - (tilesVisible * scaledTileSize),
    y: SCREEN_HEIGHT - (8 * scaledTileSize + (192))
  }
};

export default class Play extends Phaser.Scene {
  constructor () {
    super({
      key: 'play',
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
    this.canThrow = true;
    this.canShift = true;

    this.tileSprites = this.add.container();

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

    // Adding manual shift button
    this.children.add(new Button(
      this,
      SCREEN_WIDTH - (100 * SCALE * 0.75),
      SCREEN_HEIGHT - (50 * SCALE * 0.75),
      'Shift',
      false,
      () => { this.handleShiftButton(); }
    ));

    // Volume control
    this.children.add(new SoundControl(this, this.game.sound.mute));

    // Creating the player
    this.player = this.children.add(new Player(this, (SCREEN_WIDTH - (12 * gameOptions.tileSize)), SCREEN_HEIGHT - 500));
    this.physics.add.collider(this.player, this.ground);

    // Create game board
    this.match2 = new Match2({
      columns: 7,
      rows: 8,
      items: gemsArray.length
    });
    this.match2.generateGrid();

    this.initTiles();
    this.input.on('pointerdown', this.selectTile, this);

    // Auto shift tiles timer
    this.autoShiftTimer = 15000;

    this.autoShift = this.time.addEvent({
      delay: this.autoShiftTimer,
      callback: this.handleShiftButton,
      callbackScope: this,
      loop: true
    });

    // Detect clusters
    this.areClusters();
  }

  update () {
    if (this.gameOver) {
      this.scene.stop().run('end');

      return;
    }

    if (this.projectile) {
      this.projectile.rotation += 0.1;

      for (let i = 0; i < this.projectilesGroup.getChildren().length; i++) {
        let child = this.projectilesGroup.getChildren()[i];
        child.update();
      }
    }
  }

  // Game Logic and Functions

  // These two functions handle filling the game grid with created tiles
  initTiles () {
    for (let i = 0; i < this.match2.getColumns(); i++) {
      for (let j = 0; j < this.match2.getRows(); j++) {
        let tile = this.addTile(i, j);

        this.match2.gameArray[i][j] = tile;
      }
    }
  }

  addTile (col, row) {
    // Randomly select a sprite from the array of sprites
    let gemIndex = Math.floor(Math.random() * gemsArray.length);
    let spriteToAdd = gemsArray[gemIndex];

    // Adjust x and y of tile based on board offset and tile size
    let tileX = (gameOptions.boardOffset.x - (gameOptions.tileSize * this.shiftsCompleted)) + gameOptions.tileSize * col + gameOptions.tileSize / 2;
    let tileY = gameOptions.boardOffset.y + gameOptions.tileSize * row + gameOptions.tileSize / 2;

    // Add sprite to the scene and tweak some visuals
    let sprite = this.add.sprite(tileX, tileY, 'gem' + gemIndex);
    let spriteScale = (gameOptions.tileSize / sprite.width);

    sprite.setScale(spriteScale);
    sprite.setOrigin(0.5, 0.5);

    // Add custom data to sprite for later use
    sprite.value = spriteToAdd.value;

    this.tileSprites.add(sprite);

    // Create tile to be used to fill board; contains trackers for game logic
    let tile = {
      column: col,
      row: row,
      sprite: sprite,
      processed: false,
      empty: false
    };

    return tile;
  }

  // Function to scan tiles for clusters
  areClusters () {
    let areClusters = false;
    // Loop through game board
    for (let i = 0; i < tilesVisible; i++) {
      for (let j = 0; j < this.match2.rows; j++) {
        let cluster = this.match2.findCluster(i, j, true);

        if (cluster.length > 1) {
          areClusters = true;
        }
      }
    }

    return areClusters;
  }

  // Function that handles logic when a tile is selected
  selectTile (pointer) {
    let col = Math.floor((pointer.x - (gameOptions.boardOffset.x - (gameOptions.tileSize * this.shiftsCompleted))) / gameOptions.tileSize);
    let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.tileSize);

    // Determine if selection is valid; execute game sequences if so
    if (this.match2.validPick(col, row)) {
      let selection = this.match2.gameArray[col][row];

      if (!selection.empty && this.canThrow) {
        // Animation for player to throw weapon
        this.throwWeapon(pointer);

        // Utilize findCluster to find a group of neighboring sprites that match selected sprite
        let cluster = this.match2.findCluster(col, row, true);
        let clusterValue = cluster.length * cluster[0].sprite.value;

        // Calculate time it takes for projectile to reach sprite to properly setTimeout
        let tileX = selection.sprite.x;
        let projectileX = this.projectile.x;
        let projectileDistance = tileX - projectileX;
        let projectileTimeout = (projectileDistance / (SCREEN_WIDTH * 2)) * 1000;

        // If a valid cluster is found, destroy all sprites within cluster
        // Decrease score by 1 point if not a cluster
        setTimeout(() => {
          this.game.thudSound = this.sound.add('thud', 1, true);
          this.game.thudSound.play();

          if (cluster.length > 1) {
            cluster.forEach(tile => {
              this.addParticleEffect(tile.sprite.x, tile.sprite.y, 'tileExplosion');
              tile.sprite.destroy();
              tile.sprite = {};
              tile.empty = true;
            });
            this.changeScore(clusterValue);
            this.resetTiles();
          } else {
            this.changeScore(-1);
          }

          setTimeout(() => {
            this.canThrow = true;
            this.canShift = true;
          }, 500);
        }, projectileTimeout);
      }
    }
  }

  addParticleEffect (x, y, sprite) {
    let explosion = this.add.sprite(x, y, sprite);
    explosion.displayWidth = scaledTileSize;
    explosion.displayHeight = scaledTileSize;
    explosion.setScale(0.01);

    this.tweens.add({
      targets: explosion,
      scale: 0.5,
      ease: 'Circ',
      duration: 150,
      yoyo: true,
      onComplete: function () {
        explosion.destroy();
      }
    });
  }

  // Player throws weapon toward cursor click
  throwWeapon (pointer) {
    // Create group to store projectile
    this.projectilesGroup = this.add.group();

    // Change player's version to throwing for simulated animation
    this.player.setTexture('playerThrow');

    // Create new projectile from Projectile component and then add to group
    this.projectile = this.children.add(new Projectile(this, this.player.getBounds().right, this.player.getBounds().centerY, pointer));
    this.projectilesGroup.add(this.projectile);

    // Reset player back to idle version
    this.input.on('pointerup', () => {
      this.player.setTexture('playerIdle');
    });

    this.game.throwSound = this.sound.add('throw', 1, true);
    this.game.throwSound.play();

    this.canThrow = false;
  }

  // Change game score and update on-screen text
  changeScore (amount) {
    this.score += amount;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  // Reset tiles to fill empty spots left by destroyed clusters
  resetTiles () {
    // Loop through each column
    for (let i = 0; i < tilesVisible; i++) {
      // Array to track spaces for each tile in a column to drop
      let spacesArray = [];
      // Loop through each tile within column, from bottom to top
      for (let j = this.match2.rows - 1; j >= 0; j--) {
        // If tile is empty but tile above is not empty
        if (this.match2.gameArray[i][j].empty && this.match2.gameArray[i][j - 1] && !this.match2.gameArray[i][j - 1].empty) {
          // Reference to tile above an empty tile
          let tempTile = this.match2.gameArray[i][j - 1];

          // Function that runs through each row of a column
          // Tracks empty spaces below a tile to determine how far to drop
          let spacesBelow = 0;

          for (let k = j; k < this.match2.rows; k++) {
            if (this.match2.gameArray[i][k].empty) {
              spacesBelow += 1;
              spacesArray.push(spacesBelow);
            }
          }

          // The way the loop works, it is necessary to grab the max spaces
          let spacesToMove = Math.max.apply(Math, spacesArray);

          // Animate tile sliding down with Phaser tween
          this.tweens.add({
            targets: tempTile.sprite,
            y: tempTile.sprite.y + (spacesToMove * gameOptions.tileSize),
            duration: 200,
            yoyo: false
          });

          // Set empty tile's data to match the filled tile
          this.match2.gameArray[i][j].sprite = tempTile.sprite;
          this.match2.gameArray[i][j].empty = false;

          // Empty the filled tile's data to prep for move
          tempTile.sprite = {};
          tempTile.empty = true;

          j = this.match2.rows;
        }
      }
    }

    let clustersPresent = this.areClusters();

    if (!clustersPresent) {
      setTimeout(() => { this.handleShiftButton(); }, 1000);
    }
  }

  // Function that handles the logic when the shift button is clicked
  handleShiftButton () {
    if (this.shiftsCompleted < this.shiftsNeeded && this.canShift === true) {
      this.shiftTiles();
      setTimeout(() => { this.canShift = true; }, 1000);

      this.autoShift.reset({
        delay: this.autoShiftTimer,
        callback: this.handleShiftButton,
        callbackScope: this,
        loop: true
      });
    } else if (this.shiftsCompleted === this.shiftsNeeded) {
      // Show level completion success popup
      this.advancePopup();
      this.autoShift.remove();
    }
  }

  // Function to shift tiles toward player
  shiftTiles () {
    this.insertColumn();

    let gap = this.findGap();

    // Update shift information
    this.shiftsCompleted += 1;
    this.levelText.setText(`Level ${this.level}: (${this.shiftsCompleted} / ${this.shiftsNeeded}) shifts`);
    this.canShift = false;

    tilesVisible += 1;

    // Fill right column before shift
    for (let j = 0; j < this.match2.getRows(); j++) {
      let tile = this.addTile(tilesVisible, j);

      this.match2.gameArray[tilesVisible][j] = tile;
    }

    // Shift tiles to the left
    for (let i = gap; i < tilesVisible; i++) {
      for (let j = 0; j < this.match2.rows; j++) {
        // Empty tile
        let currentTile = this.match2.gameArray[i][j];

        // Reference to tile right of empty
        let tempTile = this.match2.gameArray[i + 1][j];

        // Fill empty tile with tile to the right
        currentTile.sprite = tempTile.sprite;
        currentTile.empty = tempTile.empty;

        this.tweens.add({
          targets: currentTile.sprite,
          x: currentTile.sprite.x - gameOptions.tileSize,
          duration: 500,
          yoyo: false
        });

        this.game.scrapeSound = this.sound.add('scrape', { volume: 0.01 });
        this.game.scrapeSound.play();

        // Empty filled tile
        tempTile.sprite = {};
        tempTile.empty = true;
      }
    }

    // Determine player and tiles overlap
    let playerRightBound = this.player.getBounds().right;
    let tileLeftBound = this.tileSprites.first.x - (gameOptions.tileSize / 2);

    if (tileLeftBound <= playerRightBound + gameOptions.tileSize && gap <= 0) {
      this.losePopup();
      this.autoShift.remove();
    }
  }

  findGap () {
    let gapColumn;

    for (let i = tilesVisible; i >= 0; i--) {
      if (this.match2.gameArray[i][this.match2.rows - 1].empty) {
        gapColumn = i;
        return gapColumn;
      }
    }
  }

  // Insert empty column into game board before shifting
  insertColumn () {
    let gameArray = this.match2.gameArray;

    // Insert an empty left side column
    let leftColumn = [];

    for (let i = 0; i < this.match2.rows; i++) {
      let newTile = {
        column: 0,
        row: i,
        sprite: {},
        processed: false,
        empty: true
      };
      leftColumn.push(newTile);
    }

    gameArray.unshift(leftColumn);

    // Insert a to-be-filled right side column
    let rightColumn = [];

    for (let j = 0; j < this.match2.rows; j++) {
      let newTile = {
        column: tilesVisible,
        row: j,
        sprite: {},
        processed: false,
        empty: true
      };
      rightColumn.push(newTile);
    }

    gameArray.push(rightColumn);

    // Adjust tile data to match column shift
    for (let i = 1; i <= tilesVisible + 1; i++) {
      for (let j = 0; j < this.match2.rows; j++) {
        this.match2.gameArray[i][j].column = i;
      }
    }
  }

  advancePopup () {
    this.canThrow = false;
    this.canShift = false;

    this.overlay = this.add.renderTexture(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.overlay.fill(0x000000, 0.5);

    this.children.add(new Popup(this, 'Level complete!', () => {
      this.advanceLevel();
    }));
  }

  losePopup () {
    this.canThrow = false;
    this.canShift = false;

    this.overlay = this.add.renderTexture(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.overlay.fill(0x000000, 0.5);

    this.children.add(new Popup(this, 'Better luck next time!', () => {
      this.scene.start('submitScore', { score: this.score, mute: this.mute });
    }));
  }

  advanceLevel () {
    // Increase score by 100 for successfully advancing
    if (!this.level === 0) {
      this.changeScore(100);
    }

    // Remove sprites from game board to prep for new game board gen
    this.tileSprites.removeAll(true);
    this.overlay.destroy();

    // Increase level and shifts needed, while resetting text and shifts completed
    // This sets the data for the next level
    this.level += 1;
    this.shiftsCompleted = 0;
    this.shiftsNeeded += 4;
    tilesVisible = 2;
    this.levelText.setText(`Level ${this.level}: (${this.shiftsCompleted} / ${this.shiftsNeeded})`);

    // Generate a new game board for the next level
    this.match2 = new Match2({
      columns: 7,
      rows: 8,
      items: 4
    });
    this.match2.generateGrid();
    this.initTiles();

    // Allow user to play game again
    setTimeout(() => {
      this.canThrow = true;
      this.canShift = true;
    }, 3000);

    this.autoShift = this.time.addEvent({
      delay: this.autoShiftTimer,
      callback: this.handleShiftButton,
      callbackScope: this,
      loop: true
    });
  }
}
