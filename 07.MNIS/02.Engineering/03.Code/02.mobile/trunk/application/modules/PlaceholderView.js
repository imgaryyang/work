import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import Global from '../Global';

export default class PlaceholderView extends Component {
  render() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER, this.props.style]} >
        <ActivityIndicator />
      </View>
    );
  }
}
