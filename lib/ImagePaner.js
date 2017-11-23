/* @flow */

import React from 'react'
import {
  Animated,
  Platform,
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
  zoomedImageMeasurements: ImageMeasurements,
  infoView: ?React.Component<*>,
  infoTitle: ?string,
  infoTitleStyles: ?Animated.View.style,
  infoDescription: ?string,
  infoDescriptionStyles: ?Animated.View.style,
  closeText: ?string,
  enableTilt: ?boolean
}

class ImagePaner extends React.PureComponent<Props> {
  _listener: any
  _scroll: Animated.ScrollView
  _buttonOpacity: Animated.Value
  _x: Animated.Value

  static defaultProps = {
    imageWidth: 1129, // Arbitrary value
    imageHeight: 750, // Arbitrary value
    enableTilt: false
  }

  constructor(props: Props) {
    super(props)
    this._listener = null
    this._scroll = null
    this._buttonOpacity = new Animated.Value(0)
    this._x = new Animated.Value(0)
  }

  componentWillMount() {
    if (this.props.enableTilt) {
      this._listener = motionManagerEmitter.addListener(
        'MotionManager',
        this._onYawUpdate
      )
    }
  }

  componentDidMount() {
    if (this.props.enableTilt) {
      RNIKInteractiveImageLibrary.startYawUpdates()
    }
  }

  componentWillUnmount() {
    if (this.props.enableTilt) {
      RNIKInteractiveImageLibrary.stopYawUpdates()
      this._listener.remove()
    }
  }

  _onLoad = () => {
    if (Platform.OS === 'android') {
      this._scroll &&
        this._scroll.scrollTo({
          x: -this.props.zoomedImageMeasurements.x,
          y: 0,
          animated: false
        })
    }
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
      if (this.props.enableTilt === false) {
        if (Platform.OS === 'ios') {
          this._scroll.scrollTo({
            x: -this.props.zoomedImageMeasurements.x,
            y: 0,
            animated: false
          })
        }
      }
    }
  }

  _renderInfoView() {
    if (this.props.infoView) {
      // TODO: add the possibility to use a custom info viewer
      return (
        <Animated.View style={{ opacity: this._buttonOpacity }}>
          {this.props.infoView}
        </Animated.View>
      )
    }
    if (this.props.infoTitle) {
      return (
        <Animated.View
          style={[styles.infoTextContainer, { opacity: this._buttonOpacity }]}
        >
          <Animated.View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.titleText,
                styles.textShadow,
                this.props.infoTitleStyles
              ]}
              numberOfLines={1}
            >
              {this.props.infoTitle.toUpperCase()}
            </Animated.Text>
            <Animated.Text
              style={[
                styles.descText,
                styles.textShadow,
                this.props.infoDescriptionStyles
              ]}
              numberOfLines={0}
            >
              {this.props.infoDescription}
            </Animated.Text>
          </Animated.View>
          <TouchableWithoutFeedback onPress={this.props.onPressPaner}>
            <Animated.View
              style={[
                styles.closeTextContainer,
                { opacity: this._buttonOpacity }
              ]}
            >
              <Animated.Text
                style={[
                  styles.smallCloseText,
                  styles.textShadow,
                  this.props.infoTitleStyles
                ]}
              >
                {this.props.closeText
                  ? this.props.closeText.toUpperCase()
                  : 'CLOSE'}
              </Animated.Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      )
    } else {
      return (
        <TouchableWithoutFeedback onPress={this.props.onPressPaner}>
          <Animated.View
            style={[styles.closeContainer, { opacity: this._buttonOpacity }]}
          >
            <Animated.Text style={styles.closeText}>
              {this.props.closeText || 'Close'}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      )
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
        <StatusBar animated={true} hidden={true} barStyle='light-content' />
        <Animated.ScrollView
          ref={this._handleRef}
          horizontal={true}
          bounces={true}
          style={{
            backgroundColor: 'black'
          }}
        >
          <Animated.Image
            source={this.props.source}
            onLoad={this._onLoad}
            style={{
              position: this.props.enableTilt ? 'absolute' : 'relative',
              width: this.props.zoomedImageMeasurements.width,
              height: this.props.zoomedImageMeasurements.height,
              transform: [
                {
                  translateX: this.props.enableTilt
                    ? this._x.interpolate({
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
                    : new Animated.Value(0)
                }
              ]
            }}
          />
        </Animated.ScrollView>
        {this._renderInfoView()}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  infoTextContainer: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    width: Dimensions.get('window').width - 50,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: { flex: 1 },
  titleText: {
    color: 'white',
    fontSize: 11,
    backgroundColor: 'transparent',
    fontWeight: '500'
  },
  descText: {
    color: 'white',
    fontSize: 11,
    backgroundColor: 'transparent'
  },
  textShadow: {
    textShadowOffset: { width: 1, height: 1 },
    textShadowColor: '#333',
    textShadowRadius: 2
  },
  closeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
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
  },
  smallCloseText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginLeft: 20
  }
})

export default ImagePaner
