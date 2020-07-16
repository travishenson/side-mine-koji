export const SCREEN_WIDTH = window.innerWidth * window.devicePixelRatio;
export const SCREEN_HEIGHT = window.innerHeight * window.devicePixelRatio;

const GAME_MIN_WIDTH = 1080
const GAME_MIN_HEIGHT = 1080

const MARGIN = 20
export const PADDING = MARGIN / 2

// export let Size = {
//     update: function() {
//         this.width = SCREEN_WIDTH
//         this.height = SCREEN_HEIGHT

//         this.centerX = SCREEN_WIDTH / 2
//         this.centerY = SCREEN_HEIGHT / 2

//         const scaleWidth = this.width / GAME_MIN_WIDTH
//         const scaleHeight = this.height / GAME_MIN_HEIGHT
//         this.scale = (scaleWidth >= scaleHeight) ? scaleHeight : scaleWidth

//         this.margin = MARGIN * this.scale
//         this.padding = PADDING * this.scale
//     }
// }

// Size.update()