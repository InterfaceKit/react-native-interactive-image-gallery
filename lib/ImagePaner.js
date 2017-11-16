/* @flow */

import React from 'react'
import {
  Animated,
  StatusBar,
  StyleSheet,
  Dimensions,
  NativeModules,
  NativeEventEmitter,
  TouchableWithoutFeedback
} from 'react-native'

const { RNIKInteractiveImageLibrary } = NativeModules
const motionManagerEmitter = new NativeEventEmitter(RNIKInteractiveImageLibrary)

import type { ImageMeasurements } from './Utils'

type Props = {
  source: Animated.Image.source,
  imageWidth: number,
  imageHeight: number,
  onPressPaner: Function,
  transition: Animated.Value,
  zoomedImageMeasurements: ImageMeasurements
}

class ImagePaner extends React.PureComponent<Props> {
  _listener: any
  _scroll: Animated.ScrollView
  _buttonOpacity: Animated.Value
  _x: Animated.Value

  static defaultProps = {
    imageWidth: 1129,
    imageHeight: 750
  }

  constructor(props: Props) {
    super(props)
    this._listener = null
    this._scroll = null
    this._buttonOpacity = new Animated.Value(0)
    this._x = new Animated.Value(0)
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

  componentWillUnmount() {
    RNIKInteractiveImageLibrary.stopYawUpdates()
    this._listener.remove()
  }

  _onLoad = () => {
    Animated.timing(this._buttonOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
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

  render() {
    return (
      <Animated.View
        style={[
          {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'black'
          },
          {
            opacity: this.props.transition.interpolate({
              inputRange: [0.998, 1],
              outputRange: [0, 1]
            })
          }
        ]}
      >
        <Animated.ScrollView
          horizontal={true}
          bounces={true}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'black'
          }}
        >
          <StatusBar animated={true} hidden={true} />
          <Animated.Image
            source={this.props.source}
            onLoad={this._onLoad}
            style={{
              position: 'absolute',
              width: this.props.zoomedImageMeasurements.width,
              height: this.props.zoomedImageMeasurements.height,
              transform: [
                {
                  translateX: this._x.interpolate({
                    inputRange: [-Math.PI / 7, 0, Math.PI / 7],
                    outputRange: [
                      0,
                      this.props.zoomedImageMeasurements.x,
                      -(
                        this.props.zoomedImageMeasurements.width +
                        this.props.zoomedImageMeasurements.x
                      )
                    ],
                    extrapolate: 'clamp'
                  })
                }
              ]
            }}
          />
        </Animated.ScrollView>
        <TouchableWithoutFeedback onPress={this.props.onPressPaner}>
          <Animated.View
            style={[styles.closeContainer, { opacity: this._buttonOpacity }]}
          >
            <Animated.Text style={styles.closeText}>Close</Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  closeContainer: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    width: Dimensions.get('window').width - 50,
    height: 50,
    backgroundColor: '#222',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  }
})

export default ImagePaner
