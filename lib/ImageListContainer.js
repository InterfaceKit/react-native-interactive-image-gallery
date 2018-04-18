/* @flow */

import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import ImageCell from './ImageCell'

import type { ImageSource } from './ImageBrowser'

type Props = {
  images: Array<ImageSource>,
  onPressImage: Function,
  displayImageViewer: boolean,
  displayedImageId: ?string,
  topMargin: number
}

class ImageListContainer extends React.PureComponent<Props> {
  static propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired
      })
    ).isRequired,
    onPressImage: PropTypes.func.isRequired,
    displayImageViewer: PropTypes.bool.isRequired,
    displayedImageId: PropTypes.string,
    topMargin: PropTypes.number.isRequired
  }

  _renderItem = (item: { item: ImageSource, index: number }) => {
    const { displayImageViewer, displayedImageId } = this.props
    return (
      <ImageCell
        key={`ImageCellId-${item.item.id}`}
        imageId={item.item.id}
        source={{ uri: item.item.thumbnail }}
        onPressImage={this.props.onPressImage}
        shouldHideDisplayedImage={
          displayImageViewer && displayedImageId === item.item.id
        }
        topMargin={this.props.topMargin}
      />
    )
  }

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.props.images}
        extraData={this.props.displayedImageId}
        numColumns={2}
        keyExtractor={(item: ImageSource) => item.id}
        renderItem={this._renderItem}
        horizontal={false}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default ImageListContainer
