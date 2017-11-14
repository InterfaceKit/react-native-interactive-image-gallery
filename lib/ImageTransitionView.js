/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import { Animated, StyleSheet } from 'react-native'

import type { ImageMeasurements } from './Utils'

type Props = {
  source: Animated.Image.source,
  transitionProgress: Animated.Value,
  dismissScrollProgress: Animated.Value,
  initialImageMeasurements: ImageMeasurements,
  openImageMeasurements: ImageMeasurements,
  imageWidth: number,
  imageHeight: number,
  width: number,
  height: number
}

const OPACITY_RANGE: Array<number> = [0.01, 0.015, 0.999, 1]
const TRANSITION_RANGE: Array<number> = [0.02, 0.998]

class ImageTransitionView extends React.PureComponent<Props> {
  static propTypes = {
    source: PropTypes.any.isRequired,
    transitionProgress: PropTypes.oneOfType([
      PropTypes.instanceOf(Animated.Value),
      PropTypes.instanceOf(Animated.Interpolation)
    ]).isRequired,
    dismissScrollProgress: PropTypes.instanceOf(Animated.Value).isRequired,
    initialImageMeasurements: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired,
    openImageMeasurements: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }

  render() {
    const {
      width,
      height,
      source,
      imageWidth,
      imageHeight,
      transitionProgress,
      dismissScrollProgress,
      openImageMeasurements,
      initialImageMeasurements
    } = this.props
    let startScale: number = 0
    let startTranslateX: number = 0
    let startTranslateY: number = 0
    let inlineAspectX: number = 1
    let inlineAspectY: number = 1
    const aspectRatio: number = imageWidth / imageHeight
    const screenAspectRatio: number = width / height
    if (aspectRatio - screenAspectRatio > 0) {
      const maxDim: number = openImageMeasurements.width
      const srcShortDim: number = initialImageMeasurements.height
      const srcMaxDim: number = srcShortDim * aspectRatio
      startScale = srcMaxDim / maxDim
      inlineAspectX =
        initialImageMeasurements.width /
        initialImageMeasurements.height /
        aspectRatio
      inlineAspectY = aspectRatio
    } else {
      const maxDim: number = openImageMeasurements.height
      const srcShortDim: number = initialImageMeasurements.width
      const srcMaxDim: number = srcShortDim / aspectRatio
      startScale = srcMaxDim / maxDim
      inlineAspectX = 1 / aspectRatio
      inlineAspectY =
        aspectRatio *
        initialImageMeasurements.height /
        initialImageMeasurements.width
    }
    const translateInitY: number =
      initialImageMeasurements.y + initialImageMeasurements.height / 2
    const translateDestY: number =
      openImageMeasurements.y + openImageMeasurements.height / 2
    startTranslateY = Math.floor(translateInitY - translateDestY)
    const translateInitX: number =
      initialImageMeasurements.x + initialImageMeasurements.width / 2
    const translateDestX: number =
      openImageMeasurements.x + openImageMeasurements.width / 2
    startTranslateX = Math.floor(translateInitX - translateDestX)

    const translateY = dismissScrollProgress
      ? Animated.add(
          transitionProgress.interpolate({
            inputRange: TRANSITION_RANGE,
            outputRange: [startTranslateY, 0]
          }),
          Animated.multiply(
            dismissScrollProgress.interpolate({
              inputRange: [0, height, height * 2],
              outputRange: [300, 0, -300]
            }),
            dismissScrollProgress.interpolate({
              inputRange: [0, height * 0.5, height, height * 1.5, height * 2],
              outputRange: [0, 1, 1, 1, 0]
            })
          )
        )
      : transitionProgress.interpolate({
          inputRange: TRANSITION_RANGE,
          outputRange: [startTranslateY, 0]
        })

    return (
      <Animated.View
        pointerEvents='none'
        style={{
          width: openImageMeasurements.width,
          height: openImageMeasurements.height,
          left: openImageMeasurements.x,
          top: openImageMeasurements.y,
          position: 'absolute',
          backgroundColor: 'transparent',
          overflow: 'hidden',
          opacity: transitionProgress.interpolate({
            inputRange: OPACITY_RANGE,
            outputRange: [0, 1, 1, 0]
          }),
          transform: [
            {
              translateX: transitionProgress.interpolate({
                inputRange: TRANSITION_RANGE,
                outputRange: [startTranslateX, 0]
              })
            },
            { translateY },
            {
              scale: transitionProgress.interpolate({
                inputRange: TRANSITION_RANGE,
                outputRange: [startScale, 1]
              })
            },
            {
              scaleX: transitionProgress.interpolate({
                inputRange: TRANSITION_RANGE,
                outputRange: [inlineAspectX, 1]
              })
            },
            {
              scaleY: transitionProgress.interpolate({
                inputRange: TRANSITION_RANGE,
                outputRange: [inlineAspectY, 1]
              })
            }
          ]
        }}
      >
        <Animated.Image
          source={source}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'transparent',
            transform: [
              {
                scaleX: transitionProgress.interpolate({
                  inputRange: TRANSITION_RANGE,
                  outputRange: [1 / inlineAspectX, 1]
                })
              },
              {
                scaleY: transitionProgress.interpolate({
                  inputRange: TRANSITION_RANGE,
                  outputRange: [1 / inlineAspectY, 1]
                })
              }
            ]
          }}
        />
      </Animated.View>
    )
  }
}

export default ImageTransitionView
