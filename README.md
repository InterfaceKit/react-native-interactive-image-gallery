# react-native-interactive-image-library

<p>
<img src="https://img.shields.io/npm/dm/react-native-interactive-image-library.svg" />
<img src="https://img.shields.io/npm/dt/react-native-interactive-image-library.svg" />
</p>

A React Native component to display a gallery of images.

<p align="center">
<img src="https://raw.githubusercontent.com/wiki/InterfaceKit/react-native-interactive-image-library/ios.gif" alt="iOS" width="400">
<img src="https://raw.githubusercontent.com/wiki/InterfaceKit/react-native-interactive-image-library/android.gif" alt="Android" width="400">
</p>

## Getting started

`$ yarn add react-native-interactive-image-library`

### Mostly automatic installation

`$ react-native link react-native-interactive-image-library`

### Manual installation

#### iOS

1. In Xcode, in the project navigator, right click `Libraries` ➜ `Add Files to
   [your project's name]`
2. Go to `node_modules` ➜ `react-native-interactive-image-library` and add
   `RNIKInteractiveImageLibrary.xcodeproj`
3. In XCode, in the project navigator, select your project. Add
   `libRNIKInteractiveImageLibrary.a` to your project's `Build Phases` ➜ `Link
   Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

No additional setup needed.

## Usage

```javascript
import ImageBrowser from 'react-native-interactive-image-gallery';

class Images extends React.PureComponent<Props> {
  render() {
    const imageURLs: Array<Object> = this.props.images.map(
      (img: Object, index: number) => ({
        URI: img.uri,
        id: String(index),
        title: img.title,
        description: img.description
      })
    );
    return <ImageBrowser images={imageURLs} />;
  }
}
```

## API

Work in progress.

## License

MIT.

## Author

Álvaro Medina Ballester `<amedina at apsl.net>`

Built with 💛 by [APSL](https://github.com/apsl).
