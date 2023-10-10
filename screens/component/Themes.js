import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('screen');
const COLORS = {
  white: '#fff',
  black: '#000',
  blue: '#5D5FEE',
  grey: '#BABBC3',
  light: '#F3F4FB',
  darkBlue: '#7978B5',
  red: 'red',
};

const SIZES = {
  h1: 24,
  h2: 16,
  h3: 20,
  h4: 10,
  width,
  height,
};

export { COLORS, SIZES }
