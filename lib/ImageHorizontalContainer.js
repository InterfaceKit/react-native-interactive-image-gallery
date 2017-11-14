/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import { Animated, FlatList, StyleSheet } from 'react-native'
import OpenedImageView from './OpenedImageView'
import { getImageScale } from './Utils'

import type { ImageSource } from './ImageBrowser'

type ViewableItem = {
  index: number,
  item: ImageSource,
  key: string,
  isViewable: boolean
}
type Props = {
  images: Array<ImageSource>,
  imageId: string,
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number,
  realImageWidth: number,
  realImageHeight: number,
  openProgress: ?Animated.Value,
  dismissProgress: ?Animated.Value,
  transitionProgress: Animated.Value,
  onChangePhoto: Function,
  openImageMeasurements: Object
}
type State = {
  imageWidth: number,
  imageHeight: number,
  zoomTransition: ?Animated.Value,
  zoomOn: boolean
}

class ImageHorizontalContainer extends React.PureComponent<Props, State> {
  state: State
  _flatList: FlatList<*>

  static propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        URI: PropTypes.string.isRequired
      })
    ).isRequired,
    imageId: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    realImageWidth: PropTypes.number.isRequired,
    realImageHeight: PropTypes.number.isRequired,
    openProgress: PropTypes.oneOfType([
      PropTypes.instanceOf(Animated.Value),
      PropTypes.instanceOf(Animated.Interpolation)
    ]),
    dismissProgress: PropTypes.oneOfType([
      PropTypes.instanceOf(Animated.Value),
      PropTypes.instanceOf(Animated.Interpolation)
    ]),
    transitionProgress: PropTypes.oneOfType([
      PropTypes.instanceOf(Animated.Value),
      PropTypes.instanceOf(Animated.Interpolation)
    ]).isRequired,
    onChangePhoto: PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      imageWidth: props.imageWidth,
      imageHeight: props.imageHeight,
      zoomTransition: new Animated.Value(0),
      zoomOn: false
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.imageWidth > 0 && nextProps.imageHeight > 0) {
      this.setState({
        imageWidth: nextProps.imageWidth,
        imageHeight: nextProps.imageHeight
      })
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.zoomOn && this.state.zoomTransition) {
      Animated.timing(this.state.zoomTransition, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500
      }).start()
    }
  }

  _onPressImage = () => {
    this.setState({ zoomOn: true })
  }

  _onViewableItemsChanged = (params: {
    viewableItems: Array<any>,
    changed: Array<any>
  }) => {
    const item: ViewableItem = params.viewableItems[0]
    if (
      !this.props.openProgress &&
      !this.props.dismissProgress &&
      item &&
      item.item.id !== this.props.imageId
    ) {
      this.props.onChangePhoto(item.item.id)
    }
  }

  _getItemLayout = (items: any, index: number) => {
    return {
      length: this.props.width,
      index: index,
      offset: index * this.props.width
    }
  }

  _keyExtractor = (item: ImageSource) => `OpenedImageView-${item.id}`

  _renderItem = (item: { item: ImageSource, index: number }) => {
    return (
      <OpenedImageView
        uri={item.item.URI}
        width={this.props.width}
        height={this.props.height}
        imageWidth={this.state.imageWidth}
        imageHeight={this.state.imageHeight}
        realImageWidth={this.props.realImageWidth}
        realImageHeight={this.props.realImageHeight}
        transitionProgress={this.props.transitionProgress}
        onPressImage={this._onPressImage}
      />
    )
  }

  render() {
    const initialScrollIndex: number = this.props.images.findIndex(
      (img: ImageSource) => img.id === this.props.imageId
    )
    const image: ImageSource = this.props.images[initialScrollIndex]
    return (
      <Animated.View>
        <FlatList
          ref={(ref: any) => {
            this._flatList = ref
          }}
          style={styles.container}
          data={this.props.images}
          extraData={`w${this.state.imageWidth}-h${this.state
            .imageHeight}-t${this.props.transitionProgress.__getValue()}`}
          renderItem={this._renderItem}
          getItemLayout={this._getItemLayout}
          horizontal={true}
          pagingEnabled={true}
          initialNumToRender={1}
          keyExtractor={this._keyExtractor}
          initialScrollIndex={initialScrollIndex}
          onViewableItemsChanged={this._onViewableItemsChanged}
        />
        {this.state.zoomOn &&
          this.state.zoomTransition && (
            <Animated.Image
              source={{ uri: image.URI }}
              resizeMode='contain'
              style={{
                position: 'absolute',
                width: this.props.openImageMeasurements.width,
                height: this.props.openImageMeasurements.height,
                left: this.props.openImageMeasurements.x,
                top: this.props.openImageMeasurements.y,
                transform: [
                  {
                    scale:
                      this.state.zoomTransition &&
                      this.state.zoomTransition.interpolate({
                        inputRange: [0.02, 0.998],
                        outputRange: [1, getImageScale()]
                      })
                  }
                ]
              }}
            />
          )}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default ImageHorizontalContainer
