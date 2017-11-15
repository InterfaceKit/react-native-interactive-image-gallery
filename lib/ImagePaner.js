/* @flow */

import React from 'react'
import {
  Animated,
  StatusBar,
  Dimensions,
  NativeModules,
  NativeEventEmitter
} from 'react-native'
import { getImageMeasurements } from './Utils'

const { RNIKInteractiveImageLibrary } = NativeModules
const motionManagerEmitter = new NativeEventEmitter(RNIKInteractiveImageLibrary)

import type { ImageMeasurements } from './Utils'

type Props = {
  source: Animated.Image.source,
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
  _x: Animated.Value
  _isScrolling: boolean

  static defaultProps = {
    imageWidth: 1129,
    imageHeight: 750
  }

  constructor(props: Props) {
    super(props)
    const measurements: ImageMeasurements = getImageMeasurements({
      containerWidth: Dimensions.get('window').width,
      containerHeight: Dimensions.get('window').height,
      imageWidth: props.imageWidth || 0,
      imageHeight: props.imageHeight || 0,
      mode: 'fill'
    })
    this.state = { measurements }
    this._listener = null
    this._scroll = null
    this._imageOpacity = new Animated.Value(0)
    this._x = new Animated.Value(0)
    this._isScrolling = false
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

  _onLoad = () => {
    Animated.timing(this._imageOpacity, {
      toValue: 1,
      duration: 250
    }).start()
  }

  _onYawUpdate = (motion: { yaw: number }) => {
    this._x.setValue(motion.yaw)
  }

  _handleRef = (ref: any) => {
    if (ref) {
      this._scroll = ref.getNode()
    }
  }

  _onScroll = (e: any) => {
    // this._x.setValue(e.nativeEvent.contentOffset.x)
    // console.log('scroll', e.nativeEvent.contentOffset.x)
  }

  _scrollBegin = () => {
    this._isScrolling = true
    // console.log('Scroll Begin', this._isScrolling)
  }

  _scrollEnd = () => {
    this._isScrolling = false
    // console.log('Scroll End', this._isScrolling)
  }

  render() {
    return (
      <Animated.ScrollView
        horizontal={true}
        bounces={true}
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          backgroundColor: 'black'
        }}
        onScroll={this._onScroll}
      >
        <StatusBar animated={true} hidden={true} />
        <Animated.Image
          source={this.props.source}
          onLoad={this._onLoad}
          style={{
            position: 'absolute',
            width: this.state.measurements.width,
            height: this.state.measurements.height,
            opacity: this._imageOpacity,
            transform: [
              {
                translateX: this._x.interpolate({
                  inputRange: [-Math.PI / 7, 0, Math.PI / 7],
                  outputRange: [
                    0,
                    this.state.measurements.x,
                    -(this.state.measurements.width + this.state.measurements.x)
                  ],
                  extrapolate: 'clamp'
                })
              }
            ]
          }}
        />
        {/*<Animated.ScrollView
          ref={this._handleRef}
          horizontal={true}
          bounces={false}
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'transparent'
          }}
          alwaysBounceHorizontal={false}
          onScroll={this._onScroll}
          scrollEventThrottle={1}
          onMomentumScrollBegin={this._scrollBegin}
          onMomentumScrollEnd={this._scrollEnd}
        >
          <Animated.View
            style={{
              width: this.state.measurements.width,
              height: this.state.measurements.height,
              backgroundColor: 'transparent'
            }}
          />
          </Animated.ScrollView>*/}
      </Animated.ScrollView>
    )
  }
}

export default ImagePaner
