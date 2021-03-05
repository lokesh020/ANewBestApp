import {Dimensions,PixelRatio,Platform} from 'react-native';

const guidelineBaseWidth = 375;

export const WINDOW_HEIGHT = Dimensions.get("window").height
export const WINDOW_WIDTH = Dimensions.get("window").width

export const IS_PLATFORM_ANDROID = Platform.OS === "android"
export const IS_PLATFORM_IOS = Platform.OS === "ios"




export const scaleSize = size => (WINDOW_WIDTH/guidelineBaseWidth) * size;

// screen ratio 
export function scaleRatio(percent) {
  const heightPercent = (percent * WINDOW_HEIGHT) / 100;
  return Math.round(heightPercent);
}

export const scaleFont = size => size * PixelRatio.getFontScale();

function dimensions(top, right = top, bottom = top, left = right, property){
  let styles = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(top, right, bottom, left){
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(top, right, bottom, left){
  return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(color, offset = {height:2,width:2},
                           radius = 8, opacity = 0.2){
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}