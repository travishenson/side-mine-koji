import Koji from '@withkoji/vcc';

export const PLAYER = {
  MIN_WIDTH: 100,
  MAX_WIDTH: 350,
  INITIAL_SPRITE: {
    key: 'playerIdle',
    path: Koji.config.player.playerIdle
  },
  ANIMATIONS: {
    IDLE: {
      key: 'playerIdle',
      frames: [],
      repeat: -1,
      frameRate: 10
    },
    ATTACK: {
      key: 'playerAttack',
      frames: [],
      frameRate: 14
    }
  }
}