import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

export default class ViewText extends Component {
  render() {
    const { style, textStyle, text, ...other } = this.props;

    return (
      <View style={style} {...other} >
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});

ViewText.propTypes = {
  // viewStyle
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

  // textStyle
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

  // text
  text: PropTypes.string,
};

ViewText.defaultProps = {
  style: {},
  textStyle: {},
  text: 'ViewText',
};
