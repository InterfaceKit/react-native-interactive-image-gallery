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

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   if (this.state.transitionProgress && this.state.zoomOn) {
  //     Animated.timing(this.state.transitionProgress, {
  //       toValue: 1,
  //       useNativeDriver: true,
  //       duration: 500
  //       // easing: Easing.inOut(Easing.poly(3))
  //     }).start() //.start(() => this.setState({ transitionProgress: null }))
  //   }
  // }

  _onPressImage = () => {
    console.log('onPress', this.props)
    this.props.onPressImage()
  }

  _renderImageTransitionView() {
    // const zoomedImageMeasurements: ImageMeasurements = getImageMeasurements({
    //   containerWidth: this.state.containerWidth,
    //   containerHeight: this.state.containerHeight,
    //   imageWidth: this.props.realImageWidth,
    //   imageHeight: this.props.realImageHeight,
    //   mode: 'fill'
    // })
    // return (
    //   <Animated.Image
    //     source={{ uri: this.props.uri }}
    //     resizeMode='contain'
    //     style={{
    //       position: 'absolute',
    //       width: this.props.openImageMeasurements.width,
    //       height: this.props.openImageMeasurements.height,
    //       left: this.props.openImageMeasurements.x,
    //       top: this.props.openImageMeasurements.y,
    //       transform: [
    //         {
    //           scale:
    //             this.state.transitionProgress &&
    //             this.state.transitionProgress.interpolate({
    //               inputRange: [0.02, 0.998],
    //               outputRange: [1, 3.26]
    //             })
    //         }
    //       ]
    //     }}
    //   />
    // )
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
