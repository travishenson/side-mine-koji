export const SCREEN_WIDTH = window.innerWidth * window.devicePixelRatio;
export const SCREEN_HEIGHT = window.innerHeight * window.devicePixelRatio;

export const GAME_MIN_WIDTH = 600;
export const GAME_MIN_HEIGHT = 600;

// letterbox Scale Mode
export const SCALE_WIDTH = SCREEN_WIDTH / GAME_MIN_WIDTH;
export const SCALE_HEIGHT = SCREEN_HEIGHT / GAME_MIN_HEIGHT;
// select min(SCALE_WIDTH, SCALE_HEIGHT)
export const SCALE = (SCALE_WIDTH >= SCALE_HEIGHT) ? SCALE_HEIGHT : SCALE_WIDTH;

export const SPRITE_0 = {x: SCREEN_WIDTH/3*0 + 110*SCALE, y: SCREEN_HEIGHT/2}
export const SPRITE_1 = {x: SCREEN_WIDTH/3*1 + 110*SCALE, y: SCREEN_HEIGHT/2}
export const SPRITE_2 = {x: SCREEN_WIDTH/3*2 + 110*SCALE, y: SCREEN_HEIGHT/2}

export const BASE_TEXT_SIZE = (SCREEN_WIDTH>SCREEN_HEIGHT ? 16*SCALE : 24*SCALE);

export const SCORE = {
  fontSize: `${BASE_TEXT_SIZE}px`,
};

export const MOVES = {
  fontSize: `${BASE_TEXT_SIZE}px`,
};

export const TITLE = {
  x: SCREEN_WIDTH * 0.5,
  y: SCREEN_HEIGHT * 0.02,
  fontSize: `${BASE_TEXT_SIZE * 4}px`,
};

// --- SubmitScoreScene
export const SUBMIT = {
  x: SCREEN_WIDTH * 0.5,
  y: SCREEN_HEIGHT * 0.5,
  w: SCREEN_WIDTH * (SCREEN_WIDTH>SCREEN_HEIGHT ? 0.7 : 0.9),
  h: SCREEN_HEIGHT * 0.8,
  fontSize: `${BASE_TEXT_SIZE}px`,
};

// --- leaderboard scene
export const LEADERBOARD = {
  x: SCREEN_WIDTH * 0.5,
  y: SCREEN_HEIGHT * 0.5,
  scores_fontSize: `${BASE_TEXT_SIZE*0.7}px`
};

//console.log('layout calculator: ', {SCREEN_WIDTH, SCREEN_HEIGHT, BOARD_MIN_WIDTH, BOARD_MIN_HEIGHT, SCALE_WIDTH, SCALE_HEIGHT, SCALE, BOARD, BOARD_CENTER});
