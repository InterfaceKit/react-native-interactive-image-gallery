/* @flow */

import React from 'react'
import {
  Animated,
  Dimensions,
  NativeModules,
  NativeEventEmitter
} from 'react-native'
import { getImageMeasurements } from './Utils'

const { RNIKInteractiveImageLibrary } = NativeModules
const motionManagerEmitter = new NativeEventEmitter(RNIKInteractiveImageLibrary)

import type { ImageMeasurements } from './Utils'

type Props = {
  imageWidth: ?number,
  imageHeight: ?number
}
type State = {
  measurements: ImageMeasurements
}

class ImagePaner extends React.Component<Props, State> {
  state: State
  _listener: any
  _scroll: Animated.ScrollView
  _imageOpacity: Animated.Value

  static defaultProps = {
    imageWidth: 1129,
    imageHeight: 750
  }

  constructor(props: Props) {
    super(props)
    this._listener = null
    this._imageOpacity = new Animated.Value(0)
    this.state = {
      measurements: getImageMeasurements({
        containerWidth: Dimensions.get('window').width,
        containerHeight: Dimensions.get('window').height,
        imageWidth: props.imageWidth || 0,
        imageHeight: props.imageHeight || 0,
        mode: 'fill'
      })
    }
  }

  componentWillMount() {
    this._listener = motionManagerEmitter.addListener(
      'MotionManager',
      this._onYawUpdate
    )
  }

  componentDidMount() {
    RNIKInteractiveImageLibrary.startYawUpdates()
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    this.setState({
      measurements: getImageMeasurements({
        containerWidth: Dimensions.get('window').width,
        containerHeight: Dimensions.get('window').height,
        imageWidth: nextProps.imageWidth || 0,
        imageHeight: nextProps.imageHeight || 0,
        mode: 'fill'
      })
    })
  }

  componentWillUnmount() {
    RNIKInteractiveImageLibrary.stopYawUpdates()
    this._listener.remove()
  }

  _onYawUpdate = (motion: { yaw: number }) => {
    console.log('Motion', motion)
    this._scroll.scrollTo({
      x: -this.state.measurements.x + motion.yaw,
      y: -this.state.measurements.y,
      animated: false
    })
  }

  _handleRef = (ref: any) => {
    if (ref) {
      ref &&
        ref.getNode().scrollTo({
          x: -this.state.measurements.x,
          y: -this.state.measurements.y,
          animated: false
        })
      this._scroll = ref.getNode()
      Animated.timing(this._imageOpacity, {
        toValue: 1,
        duration: 250
      }).start()
    }
  }

  render() {
    return (
      <Animated.ScrollView
        ref={this._handleRef}
        horizontal={true}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        }}
      >
        <Animated.Image
          source={{
            uri:
              'https://vacacional-demo.s3.amazonaws.com/vacacional-001/property/finca/201706/pexels-photo-279607.jpg'
          }}
          style={{
            width: this.state.measurements.width,
            height: this.state.measurements.height,
            opacity: this._imageOpacity
          }}
        />
      </Animated.ScrollView>
    )
  }
}

export default ImagePaner
