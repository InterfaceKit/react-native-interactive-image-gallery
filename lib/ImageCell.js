/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  Easing,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

type Props = {
  imageId: string,
  source: Animated.Image.source,
  onPressImage: Function,
  shouldHideDisplayedImage: boolean,
  topMargin: number
}
type State = {
  opacity: Animated.Value,
  imageLoaded: boolean
}

class ImageCell extends React.Component<Props, State> {
  _imageRef: Animated.Image
  _readyToMeasure: boolean

  static propTypes = {
    imageId: PropTypes.string.isRequired,
    source: PropTypes.any.isRequired,
    onPressImage: PropTypes.func.isRequired,
    shouldHideDisplayedImage: PropTypes.bool.isRequired,
    topMargin: PropTypes.number.isRequired
  }

  static contextTypes = {
    onSourceContext: PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      opacity: new Animated.Value(1),
      imageLoaded: false
    }
    this._readyToMeasure = false
  }

  componentWillMount() {
    this.context.onSourceContext(
      this.props.imageId,
      this.measurePhoto,
      this.measureImageSize
    )
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    if (
      this.props.shouldHideDisplayedImage !==
        nextProps.shouldHideDisplayedImage ||
      this.state.imageLoaded !== nextState.imageLoaded
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.imageLoaded === false && this.state.imageLoaded) {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease)
      }).start()
    } else {
      if (this.props.shouldHideDisplayedImage) {
        this.state.opacity.setValue(0)
      } else {
        this.state.opacity.setValue(1)
      }
    }
  }

  measurePhoto = async () => {
    if (!this._imageRef || !this._readyToMeasure) {
      console.warn('measurePhoto: Trying to measure image without ref or layout')
    }
    return new Promise((resolve: Function, reject: Function) => {
      this._imageRef
        .getNode()
        .measure(
          (
            imgX: number,
            imgY: number,
            imgWidth: number,
            imgHeight: number,
            imgPageX: number,
            imgPageY: number
          ) => {
            resolve({
              width: imgWidth,
              height: imgHeight,
              x: imgPageX,
              y: imgPageY + this.props.topMargin
            })
          },
          reject
        )
    })
  }

  measureImageSize = async () => {
    if (!this.state.imageLoaded) {
      console.warn('measureImageSize: Undefined image size')
    }
    return new Promise((resolve: Function, reject: Function) => {
      Image.getSize(
        this.props.source.uri,
        (width: number, height: number) => {
          resolve({ width, height })
        },
        (error: Error) => {
          console.error(
            'measureImageSize: Error trying to get image size',
            JSON.stringify(error.message)
          )
          reject(error)
        }
      )
    })
  }

  _onPressImage = () => {
    // Wait for the image to load before reacting to press events
    if (this.state.imageLoaded) {
      this.props.onPressImage(this.props.imageId)
    }
  }

  render() {
    return (
      <TouchableOpacity
        key={this.props.imageId}
        style={styles.cellContainer}
        onPress={this._onPressImage}
      >
        <Animated.Image
          ref={(ref: Animated.Image) => {
            this._imageRef = ref
          }}
          onLayout={() => {
            this._readyToMeasure = true
          }}
          onLoad={() => {
            this.setState({ imageLoaded: true })
          }}
          source={this.props.source}
          resizeMode='cover'
          style={[
            {
              width: Dimensions.get('window').width / 2,
              height: Dimensions.get('window').width / 2,
              backgroundColor: 'lightgrey'
            },
            { opacity: this.state.opacity }
          ]}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cellContainer: {
    backgroundColor: 'lightgrey'
  }
})

export default ImageCell
