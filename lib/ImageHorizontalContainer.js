/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  Platform,
  FlatList,
  StyleSheet
} from 'react-native'
import OpenedImageView from './OpenedImageView'

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
  openImageMeasurements: Object,
  onPressImage: Function
}
type State = {
  imageWidth: number,
  imageHeight: number
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
    onChangePhoto: PropTypes.func.isRequired,
    onPressImage: PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      imageWidth: props.imageWidth,
      imageHeight: props.imageHeight
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

  _onPressImage = () => {
    this.props.onPressImage(this.props.imageId)
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

  _getItemLayout = (items: any, index: number) => ({
    length: this.props.width,
    index: index,
    offset: index * this.props.width
  })

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
    return (
      <FlatList
        ref={(ref: any) => {
          this._flatList = ref
        }}
        initialNumToRender={Platform.OS === 'ios' ? 1 : this.props.images.length}
        style={styles.container}
        data={this.props.images}
        extraData={`w${this.state.imageWidth}-h${
          this.state.imageHeight
        }-t${this.props.transitionProgress.__getValue()}`}
        renderItem={this._renderItem}
        getItemLayout={this._getItemLayout}
        horizontal={true}
        pagingEnabled={true}
        keyExtractor={this._keyExtractor}
        initialScrollIndex={initialScrollIndex}
        onViewableItemsChanged={this._onViewableItemsChanged}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default ImageHorizontalContainer
