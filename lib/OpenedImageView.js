/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import { Animated, TouchableWithoutFeedback } from 'react-native'

type Props = {
  uri: string,
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number,
  realImageWidth: number,
  realImageHeight: number,
  transitionProgress: Animated.Value,
  onPressImage: Function
}
type State = {
  containerWidth: number,
  containerHeight: number
}

class OpenedImageView extends React.PureComponent<Props, State> {
  state: State
  _imageRef: Animated.Image

  static propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    realImageWidth: PropTypes.number.isRequired,
    realImageHeight: PropTypes.number.isRequired,
    transitionProgress: PropTypes.oneOfType([
      PropTypes.instanceOf(Animated.Value),
      PropTypes.instanceOf(Animated.Interpolation)
    ]).isRequired,
    onPressImage: PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      containerWidth: props.width,
      containerHeight: props.height
    }
  }

  _onPressImage = () => {
    this.props.onPressImage()
  }

  render() {
    const { uri, imageWidth, imageHeight, transitionProgress } = this.props
    const { containerWidth, containerHeight } = this.state
    return (
      <Animated.View
        style={{
          width: containerWidth,
          height: containerHeight,
          flexDirection: 'row',
          alignItems: 'center',
          opacity: transitionProgress.interpolate({
            inputRange: [0.998, 0.999],
            outputRange: [0, 1]
          })
        }}
      >
        <TouchableWithoutFeedback onPress={this._onPressImage}>
          <Animated.Image
            ref={(ref: Animated.Image) => {
              this._imageRef = ref
            }}
            source={{ uri }}
            resizeMode='contain'
            style={{
              width: imageWidth,
              height: imageHeight,
              opacity: transitionProgress.interpolate({
                inputRange: [0.998, 0.999],
                outputRange: [0, 1]
              })
            }}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}

export default OpenedImageView
