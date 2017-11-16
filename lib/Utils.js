/* @flow */

import { Platform, Dimensions } from 'react-native'

export type ImageMeasurements = {
  width: number,
  height: number,
  x: number,
  y: number,
  scale: number
}

export type ImageFit = 'fit' | 'fill'

export function getImageMeasurements(sizes: {
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number,
  mode: ImageFit
}): ImageMeasurements {
  const {
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight,
    mode
  } = sizes
  const imageAspectRatio: number = imageWidth / imageHeight
  const containerAspectRatio: number = containerWidth / containerHeight
  let width: number
  let height: number
  if (mode === 'fit') {
    width = containerWidth
    height = containerWidth / imageAspectRatio
    if (imageAspectRatio - containerAspectRatio < 0) {
      height = containerHeight
      width = containerHeight * imageAspectRatio
    }
  } else {
    width = containerHeight * imageAspectRatio
    height = containerHeight
    if (imageAspectRatio - containerAspectRatio < 0) {
      height = containerWidth
      width = containerWidth / imageAspectRatio
    }
  }
  const x: number = (containerWidth - width) / 2
  const y: number = (containerHeight - height) / 2
  const scale: number = width / containerWidth
  return {
    width,
    height,
    x,
    y,
    scale
  }
}

// Taken from: https://mydevice.io/devices/
const X_WIDTH: number = 375
const X_HEIGHT: number = 812

export function isIPhoneX(): boolean {
  return (
    Platform.OS === 'ios' &&
    ((Dimensions.get('window').height === X_HEIGHT &&
      Dimensions.get('window').width === X_WIDTH) ||
      (Dimensions.get('window').height === X_WIDTH &&
        Dimensions.get('window').width === X_HEIGHT))
  )
}
