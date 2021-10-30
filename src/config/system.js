export const SCENE = {
  PRELOAD: 'Preload',
  MENU: 'Menu',
  GAME: 'Game',
  HUD: 'HUD'
};

export const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
export const DEV = document.doctype.baseURI && document.doctype.baseURI.indexOf('localhost') !== -1;
