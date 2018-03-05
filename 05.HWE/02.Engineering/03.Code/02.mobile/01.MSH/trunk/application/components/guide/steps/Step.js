import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import Global from '../../../Global';

import { TIMELINE_WIDTH } from '../OutpatientGuidance';

export default class Step extends Component {
  render() {
    return (
      <View style={styles.stepHolder} >
        <Text style={[styles.stepTime, { width: TIMELINE_WIDTH }]} >
          {this.props.step.updateTime ? moment(this.props.step.updateTime).format('M月D日 hh:mm') : ''}
        </Text>
        <View style={styles.step} >
          {this.props.children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stepHolder: {
    width: Global.getScreen().width,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  stepTime: {
    // width: 93,
    fontSize: 10,
    fontWeight: '600',
    color: Global.colors.FONT_LIGHT_GRAY,
    textAlign: 'right',
    paddingRight: 6,
    paddingTop: 2,
    // backgroundColor: 'brown',
  },
  step: {
    flex: 1,
    // backgroundColor: 'white',
    padding: 10,
    paddingLeft: 15,
    paddingTop: 0,
  },
});
