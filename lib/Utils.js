/* @flow */

export type ImageMeasurements = {
  width: number,
  height: number,
  x: number,
  y: number
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
  console.log('getImageMeasurements', {
    width,
    height,
    x,
    y
  })
  return {
    width,
    height,
    x,
    y
  }
}

export function getImageScale(): number {
  return 3.26
}
