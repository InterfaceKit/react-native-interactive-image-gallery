/* @flow */

import React from 'react'
import { Animated } from 'react-native'

type Props = {
  width: Animated.Value,
  height: Animated.Value
}

const ScrollSpacerView = (props: Props) => (
  // This is a hack to add space above and below the image for
  // being able to paginate through the ScrollView component
  <Animated.View
    style={{
      width: props.width.__getValue(),
      height: props.height.__getValue()
    }}
  />
)

export default ScrollSpacerView
