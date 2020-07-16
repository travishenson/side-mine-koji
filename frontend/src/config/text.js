import Koji from '@withkoji/vcc';
import {BASE_TEXT_SIZE, SUBMIT, SCALE, TITLE} from '../services/responsiveCalculator.js';

export const TEXT = {
  BUTTON: {
    fontSize: BASE_TEXT_SIZE * 1.5,
    color: Koji.config.colors.buttonText
  },
  GAME_TITLE: {
    string: Koji.config.strings.gameTitle,
    fontFamily: 'pirata',
    fontSize: TITLE.fontSize,
    color: Koji.config.colors.gameTitle
  },
  HEADING: {
    fontFamily: 'pirata'
  },
  BODY: {
    fontFamily: 'sans-serif',
    fontSize: BASE_TEXT_SIZE,
    color: Koji.config.colors.bodyText
  }
}