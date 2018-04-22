import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import Global from '../Global';

export default class PlaceholderView extends Component {
  render() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }, this.props.style]} >
        <ActivityIndicator />
      </View>
    );
  }
}
