# react-native-interactive-image-gallery

<p>
<img src="https://img.shields.io/npm/dm/react-native-interactive-image-gallery.svg" />
<img src="https://img.shields.io/npm/dt/react-native-interactive-image-gallery.svg" />
</p>

A React Native component to display a gallery of images.

<p align="center">
<img src="https://raw.githubusercontent.com/wiki/InterfaceKit/react-native-interactive-image-gallery/ios.gif" alt="iOS" width="400" />
<img src="https://raw.githubusercontent.com/wiki/InterfaceKit/react-native-interactive-image-gallery/android.gif" alt="Android" width="400" />
</p>

## Getting started

`$ yarn addreact-native-interactive-image-gallery`

### Mostly automatic installation

`$ react-native link react-native-interactive-image-gallery`

### Manual installation

#### iOS

1.  In Xcode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2.  Go to `node_modules` ➜ `react-native-interactive-image-gallery` and add
    `RNIKInteractiveImageLibrary.xcodeproj`
3.  In XCode, in the project navigator, select your project. Add
    `libRNIKInteractiveImageLibrary.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4.  Run your project (`Cmd+R`)<

#### Android

No additional setup needed.

## Usage

```javascript
import ImageBrowser from 'react-native-interactive-image-gallery'

class Images extends React.PureComponent<Props> {
  render() {
    const imageURLs: Array<Object> = this.props.images.map(
      (img: Object, index: number) => ({
        URI: img.uri,
        thumbnail: img.thumbnail,
        id: String(index),
        title: img.title,
        description: img.description
      })
    )
    return <ImageBrowser images={imageURLs} />
  }
}
```

## API

The `<ImageBrowser />` component accepts the following props

### Props

| Prop                                  | Type                  | Mandatory |
| ------------------------------------- | --------------------- | --------- |
| `images`                              | `Array<ImageSource>`  | **Yes**   |
| `onPressImage`                        | `Function`            |
| `topMargin`                           | `number`              |
| `closeText`                           | `string`              |
| `infoTitleStyles`                     | `Animated.View.style` |
| `infoDescriptionStyles`               | `Animated.View.style` |
| `enableTilt` (experimental, iOS only) | `boolean`             |

Where `ImageSource` represents

### `ImageSource`

| Name          | Type     | Mandatory |
| ------------- | -------- | --------- |
| `id`          | `string` | **Yes**   |
| `URI`         | `string` | **Yes**   |
| `thumbnail`   | `string` | **Yes**   |
| `title`       | `string` |
| `description` | `string` |

## Aknowledgements

Thanks to Eric Vicenti (https://github.com/ericvicenti) and
[his talk at React Native EU 2017](https://www.youtube.com/watch?v=7emqc7yf-Zg)
called "Practical Hacks for delightful interactions" for the inspiration and the
iOS animations present in this library

The main idea of the library and some parts of the code were inspired or taken
from his presentation, available at
[this repo](https://github.com/ericvicenti/react-native-eu-2017).

## License

MIT.

## Author

Álvaro Medina Ballester `<amedina at apsl.net>`

Built with 💛 by [APSL](https://github.com/apsl).
