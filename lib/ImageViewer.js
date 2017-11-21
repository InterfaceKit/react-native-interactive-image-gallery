/* @flow */

import React from 'react'
import { Easing, Platform, Animated, StyleSheet, Dimensions } from 'react-native'
import ViewerBackground from './ViewerBackground'
import ScrollSpacerView from './ScrollSpacerView'
import ImageHorizontalContainer from './ImageHorizontalContainer'
import ImageTransitionView from './ImageTransitionView'
import ImagePaner from './ImagePaner'
import { getImageMeasurements } from './Utils'

import type { ImageSource } from './ImageBrowser'
import type { ImageMeasurements } from './Utils'

type Props = {
  images: Array<ImageSource>,
  imageId: string,
  onClose: Function,
  onChangePhoto: Function,
  getSourceContext: Function,
  closeText?: string,
  infoTitleStyles: ?Animated.View.style,
  infoDescriptionStyles: ?Animated.View.style,
  enableTilt?: boolean
}
type State = {
  width: Animated.Value,
  height: Animated.Value,
  openProgress: ?Animated.Value,
  dismissProgress: ?Animated.Value,
  dismissScrollProgress: Animated.Value,
  initialImageMeasurements: ?ImageMeasurements,
  openImageMeasurements: ?ImageMeasurements,
  zoomedImageMeasurements: ?ImageMeasurements,
  imageWidth: number,
  imageHeight: number,
  zoomTransition: Animated.Value,
  zoomState: 'closed' | 'opening' | 'opened' | 'closing'
}

class ImageViewer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      width: new Animated.Value(Dimensions.get('window').width),
      height: new Animated.Value(Dimensions.get('window').height),
      openProgress: new Animated.Value(0),
      dismissProgress: null,
      dismissScrollProgress: new Animated.Value(Dimensions.get('window').height),
      initialImageMeasurements: null,
      openImageMeasurements: null,
      zoomedImageMeasurements: null,
      imageWidth: 0,
      imageHeight: 0,
      zoomTransition: new Animated.Value(0),
      zoomState: 'closed'
    }
  }

  componentDidMount() {
    this._measurePhotoSize()
  }

  componentWillReceiveProps(nextProps: Props) {
    // Measure photo on horizontal scroll change
    if (this.props.imageId !== nextProps.imageId) {
      // TOOD: add opacity effect (original LOC: 225-238)
      this.setState(
        {
          initialImageMeasurements: null,
          openImageMeasurements: null
        },
        () => this._measurePhotoSize()
      )
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    this.state.openProgress &&
      Animated.timing(this.state.openProgress, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.poly(3)),
        useNativeDriver: true
      }).start(() => this.setState({ openProgress: null }))
    if (this.state.zoomState === 'opening') {
      Animated.timing(this.state.zoomTransition, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start(() => this.setState({ zoomState: 'opened' }))
    } else if (this.state.zoomState === 'closing') {
      Animated.timing(this.state.zoomTransition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => this.setState({ zoomState: 'closed' }))
    }
  }

  _getTransitionProgress = () => {
    const gestureDismissProgress =
      this.state.dismissScrollProgress &&
      Platform.OS === 'ios' &&
      this.state.dismissScrollProgress.interpolate({
        inputRange: [
          0,
          this.state.height.__getValue(),
          this.state.height.__getValue() * 2
        ],
        outputRange: [0.02, 1, 0.02]
      })
    return (
      this.state.openProgress || gestureDismissProgress || new Animated.Value(1)
    )
  }

  _measurePhotoSize = async () => {
    const { measurer, imageSizeMeasurer } = this.props.getSourceContext(
      this.props.imageId
    )
    // Measure opened photo size
    const image: ?ImageSource = this.props.images.find(
      (img: ImageSource) => img.id === this.props.imageId
    )
    if (!image) {
      throw new Error(
        `Fatal error, impossible to find image with id: ${this.props.imageId}`
      )
    }
    const imageSize: {
      width: number,
      height: number
    } = await imageSizeMeasurer()
    const imageAspectRatio: number = imageSize.width / imageSize.height
    const height: number = this.state.height.__getValue()
    const width: number = this.state.width.__getValue()
    const screenAspectRatio: number = width / height
    let finalWidth: number = width
    let finalHeight: number = width / imageAspectRatio
    if (imageAspectRatio - screenAspectRatio < 0) {
      finalHeight = height
      finalWidth = height * imageAspectRatio
    }
    const finalX: number = (width - finalWidth) / 2
    const finalY: number = (height - finalHeight) / 2
    const openImageMeasurements: ImageMeasurements = {
      width: finalWidth,
      height: finalHeight,
      x: finalX,
      y: finalY,
      scale: finalWidth / width
    }
    // Measure initial photo size
    const initialImageMeasurements: ImageMeasurements = await measurer()
    // Measure zoomed image size
    const zoomedImageMeasurements: ImageMeasurements = getImageMeasurements({
      containerWidth: Dimensions.get('window').width,
      containerHeight: Dimensions.get('window').height,
      imageWidth: imageSize.width,
      imageHeight: imageSize.height,
      mode: 'fill'
    })
    this.setState({
      initialImageMeasurements,
      openImageMeasurements,
      zoomedImageMeasurements,
      imageHeight: imageSize.height,
      imageWidth: imageSize.width
    })
  }

  _handleRef = (ref: any) => {
    if (ref) {
      // Hack to enable scroll when the ref callback is called
      setTimeout(() => {
        ref &&
          ref.getNode().scrollResponderScrollTo({
            y: this.state.height.__getValue(),
            animated: false
          })
      }, 0)
    }
  }

  _onScroll = (e: Object) => {
    const yOffset = e.nativeEvent.contentOffset.y
    const heightValue = this.state.height.__getValue()
    if (yOffset <= 0 || yOffset >= 2 * heightValue) {
      this.props.onClose()
    }
  }

  _onPressImage = () => {
    this.setState({
      zoomState: 'opening'
    })
  }

  _onPressPaner = () => {
    this.setState({
      zoomState: 'closing'
    })
  }

  _renderZoomTransition() {
    const {
      zoomState,
      zoomTransition,
      openImageMeasurements,
      zoomedImageMeasurements
    } = this.state
    if (
      openImageMeasurements &&
      zoomedImageMeasurements &&
      (zoomState === 'opening' || zoomState === 'closing')
    ) {
      // TODO: improve this using Map
      const imageSource: ?ImageSource = this.props.images.find(
        (img: ImageSource) => img.id === this.props.imageId
      )
      return (
        <Animated.Image
          pointerEvents='none'
          source={{ uri: imageSource && imageSource.URI }}
          resizeMode='contain'
          style={{
            position: 'absolute',
            width: openImageMeasurements.width,
            height: openImageMeasurements.height,
            left: openImageMeasurements.x,
            top: openImageMeasurements.y,
            transform: [
              {
                scale: zoomTransition.interpolate({
                  inputRange: [0.02, 0.998],
                  outputRange: [1, zoomedImageMeasurements.scale]
                })
              }
            ],
            opacity: zoomTransition.interpolate({
              inputRange: [0.01, 0.015, 0.998, 1],
              outputRange: [0, 1, 1, 0],
              extrapolate: 'clamp'
            })
          }}
        />
      )
    }
  }

  _renderImagePaner() {
    const {
      zoomState,
      zoomTransition,
      openImageMeasurements,
      zoomedImageMeasurements
    } = this.state
    if (
      openImageMeasurements &&
      zoomedImageMeasurements &&
      (zoomState === 'opened' ||
        zoomState === 'closing' ||
        zoomState === 'opening')
    ) {
      // TODO: improve this using Map
      const imageSource: ?ImageSource = this.props.images.find(
        (img: ImageSource) => img.id === this.props.imageId
      )
      return (
        <ImagePaner
          source={{ uri: imageSource && imageSource.URI }}
          imageWidth={openImageMeasurements.width}
          imageHeight={openImageMeasurements.height}
          onPressPaner={this._onPressPaner}
          transition={zoomTransition}
          zoomedImageMeasurements={zoomedImageMeasurements}
          infoView={null}
          infoTitle={imageSource && imageSource.title}
          infoTitleStyles={this.props.infoTitleStyles}
          infoDescription={imageSource && imageSource.description}
          infoDescriptionStyles={this.props.infoDescriptionStyles}
          closeText={this.props.closeText}
          enableTilt={this.props.enableTilt}
        />
      )
    }
  }

  _renderVerticalScrollView(
    width: Animated.Value,
    height: Animated.Value,
    imageSource: ?ImageSource,
    openImageMeasurements: ?ImageMeasurements,
    openProgress: any,
    dismissProgress: any,
    transitionProgress: any
  ) {
    if (Platform.OS === 'ios') {
      return (
        <Animated.ScrollView
          ref={this._handleRef}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: this.state.dismissScrollProgress }
                }
              }
            ],
            { useNativeDriver: true, listener: this._onScroll }
          )}
          scrollEventThrottle={1}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <ScrollSpacerView width={width} height={height} />
          <ImageHorizontalContainer
            images={this.props.images}
            imageId={this.props.imageId}
            uri={imageSource ? imageSource.URI : ''}
            width={width.__getValue()}
            height={height.__getValue()}
            imageWidth={openImageMeasurements ? openImageMeasurements.width : 0}
            imageHeight={
              openImageMeasurements ? openImageMeasurements.height : 0
            }
            realImageWidth={this.state.imageWidth}
            realImageHeight={this.state.imageHeight}
            openProgress={openProgress}
            dismissProgress={dismissProgress}
            transitionProgress={transitionProgress}
            dismissScrollProgress={this.state.dismissScrollProgress}
            onChangePhoto={this.props.onChangePhoto}
            openImageMeasurements={openImageMeasurements || {}}
            onPressImage={this._onPressImage}
          />
          <ScrollSpacerView width={width} height={height} />
        </Animated.ScrollView>
      )
    }
    return (
      <ImageHorizontalContainer
        images={this.props.images}
        imageId={this.props.imageId}
        uri={imageSource ? imageSource.URI : ''}
        width={width.__getValue()}
        height={height.__getValue()}
        imageWidth={openImageMeasurements ? openImageMeasurements.width : 0}
        imageHeight={openImageMeasurements ? openImageMeasurements.height : 0}
        realImageWidth={this.state.imageWidth}
        realImageHeight={this.state.imageHeight}
        openProgress={openProgress}
        dismissProgress={dismissProgress}
        transitionProgress={transitionProgress}
        dismissScrollProgress={this.state.dismissScrollProgress}
        onChangePhoto={this.props.onChangePhoto}
        openImageMeasurements={openImageMeasurements || {}}
        onPressImage={this._onPressImage}
      />
    )
  }

  render() {
    const {
      width,
      height,
      imageWidth,
      imageHeight,
      openProgress,
      dismissProgress,
      openImageMeasurements,
      initialImageMeasurements
    } = this.state
    // TODO: improve this using Map
    const imageSource: ?ImageSource = this.props.images.find(
      (img: ImageSource) => img.id === this.props.imageId
    )
    const transitionProgress: any = this._getTransitionProgress()
    return (
      <Animated.View
        style={styles.topContainer}
        onLayout={Animated.event([
          { nativeEvent: { layout: { width, height } } }
        ])}
      >
        <Animated.View
          style={[styles.topContainer, { opacity: openProgress || 1 }]}
        >
          <ViewerBackground
            opacityProgress={this.state.dismissScrollProgress}
            inputRange={[0, height.__getValue(), height.__getValue() * 2]}
            outputRange={[0.02, 1, 0.02]}
          />
          {this._renderVerticalScrollView(
            width,
            height,
            imageSource,
            openImageMeasurements,
            openProgress,
            dismissProgress,
            transitionProgress
          )}
        </Animated.View>
        {initialImageMeasurements &&
          openImageMeasurements && (
            <ImageTransitionView
              source={{ uri: imageSource && imageSource.URI }}
              transitionProgress={transitionProgress}
              dismissScrollProgress={this.state.dismissScrollProgress}
              initialImageMeasurements={initialImageMeasurements}
              openImageMeasurements={openImageMeasurements}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              width={width.__getValue()}
              height={height.__getValue()}
            />
          )}
        {this._renderImagePaner()}
        {this._renderZoomTransition()}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent'
  }
})

export default ImageViewer
