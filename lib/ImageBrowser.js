/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  Platform,
  Animated,
  StyleSheet,
  SafeAreaView
} from 'react-native'
import ImageListContainer from './ImageListContainer'
import ImageViewer from './ImageViewer'

export type ImageSource = {
  id: string,
  URI: string,
  thumbnail: string,
  title: ?string,
  description: ?string
}

type Props = {
  images: Array<ImageSource>,
  onPressImage?: Function,
  topMargin?: number,
  closeText?: string,
  infoTitleStyles?: Animated.View.style,
  infoDescriptionStyles?: Animated.View.style,
  enableTilt?: boolean
}
type State = {
  displayImageViewer: boolean,
  imageId: ?string
}

class ImageBrowser extends React.Component<Props, State> {
  _imageMeasurers: { [imageId: string]: () => void }
  _imageSizeMeasurers: { [imageId: string]: () => void }

  static propTypes = {
    images: PropTypes.array.isRequired,
    onPressImage: PropTypes.func
  }

  static defaultProps = {
    topMargin: 0
  }

  static childContextTypes = {
    onSourceContext: PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      displayImageViewer: false,
      imageId: undefined
    }
    this._imageMeasurers = {}
    this._imageSizeMeasurers = {}
  }

  getChildContext() {
    return { onSourceContext: this._onSourceContext }
  }

  _onSourceContext = (
    imageId: string,
    cellMeasurer: Function,
    imageMeasurer: Function
  ) => {
    this._imageMeasurers[imageId] = cellMeasurer
    this._imageSizeMeasurers[imageId] = imageMeasurer
  }

  _getSourceContext = (imageId: string) => {
    return {
      measurer: this._imageMeasurers[imageId],
      imageSizeMeasurer: this._imageSizeMeasurers[imageId]
    }
  }

  openImageViewer = (imageId: string) => {
    this.setState({ displayImageViewer: true, imageId })
    if (this.props.onPressImage) {
      this.props.onPressImage(imageId)
    }
  }

  closeImageViewer = () => {
    this.setState({ displayImageViewer: false, imageId: undefined })
  }

  onChangePhoto = (imageId: string) => {
    this.setState({ imageId })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageListContainer
          images={this.props.images}
          onPressImage={this.openImageViewer}
          displayImageViewer={this.state.displayImageViewer}
          displayedImageId={this.state.imageId}
          topMargin={this.props.topMargin || 0}
        />
        {this.state.displayImageViewer &&
          this.state.imageId && (
            <Modal
              visible={true}
              transparent={true}
              animationType={Platform.OS === 'ios' ? 'none' : 'fade'}
              onRequestClose={this.closeImageViewer}>
              <ImageViewer
                images={this.props.images}
                imageId={this.state.imageId}
                onClose={this.closeImageViewer}
                onChangePhoto={this.onChangePhoto}
                getSourceContext={this._getSourceContext}
                closeText={this.props.closeText}
                infoTitleStyles={this.props.infoTitleStyles}
                infoDescriptionStyles={this.props.infoDescriptionStyles}
                enableTilt={this.props.enableTilt}
              />
            </Modal>
          )}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default ImageBrowser
