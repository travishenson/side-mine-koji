import Koji from '@withkoji/vcc'

const backend = Koji.config.serviceMap.backend

export const ENDPOINTS = {
    LEADERBOARD: backend + '/leaderboard',
    SUBMIT: backend + '/leaderboard/save'
}

export const SCENE = {
    PRELOAD: 'Preload',
    MENU: 'Menu',
    GAME: 'Game',
    HUD: 'HUD',
    LEADERBOARD: 'Leaderboard',
    SUBMIT: 'SubmitScore'
}

export const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
export const DEV = document.doctype.baseURI && document.doctype.baseURI.indexOf('localhost') !== -1
