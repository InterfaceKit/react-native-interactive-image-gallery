
# react-native-interactive-image-library

## Getting started

`$ npm install react-native-interactive-image-library --save`

### Mostly automatic installation

`$ react-native link react-native-interactive-image-library`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-interactive-image-library` and add `RNIKInteractiveImageLibrary.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNIKInteractiveImageLibrary.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.apsl.interfacekit.RNIKInteractiveImageLibraryPackage;` to the imports at the top of the file
  - Add `new RNIKInteractiveImageLibraryPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-interactive-image-library'
  	project(':react-native-interactive-image-library').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-interactive-image-library/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-interactive-image-library')
  	```


## Usage
```javascript
import RNIKInteractiveImageLibrary from 'react-native-interactive-image-library';

// TODO: What to do with the module?
RNIKInteractiveImageLibrary;
```
  