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
  // _acceleration: Accelerometer
  // _gyro: Gyroscope

  static defaultProps = {
    imageWidth: 1129,
    imageHeight: 750
  }

  constructor(props: Props) {
    super(props)
    this._listener = null
    this._imageOpacity = new Animated.Value(0)
    // this._acceleration = new Accelerometer({
    //   updateInterval: 100 // defaults to 100ms
    // })
    // this._acceleration
    //   .map(({ x, y, z }: any) => x + y + z)
    //   .filter((speed: number) => speed > 20)
    //   .subscribe(this._acceleration)
    // this._gyro = new Gyroscope({
    //   updateInterval: 300
    // })
    // this._gyro
    //   .filter((gyro: { x: number, y: number, z: number }) => gyro.x > 0.09)
    //   .subscribe(this._onGyroscopeUpdate)
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
    // this._acceleration.stop()
    // this._gyro.stop()
    RNIKInteractiveImageLibrary.stopYawUpdates()
    this._listener.remove()
  }

  _onYawUpdate = (motion: { yaw: number }) => {
    console.log('Motion', motion)
  }

  _onGyroscopeUpdate = (gyro: { x: number, y: number, z: number }) => {
    if (gyro.x > 0) {
      console.log('TILT RIGHT')
    } else {
      console.log('TILT LEFT')
    }
    // this._scroll.scrollTo({
    //   x: this.state.measurements.x + gyro.x,
    //   y: -this.state.measurements.y,
    //   animated: false
    // })
  }

  _onAccelerometerUpdate = (speed: number) => {
    console.log(`You moved your phone with ${speed}`)
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
