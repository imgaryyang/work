import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';

import Step from './Step';
import Global from '../../../Global';

export default class StepGeneric extends Component {
  render() {
    const { item } = this.props;
    const steps = item.steps.map((step, sidx) => {
      return (
        <Step key={`row_${sidx + 1}`} step={step} >
          <Text style={styles.stepMsg} >{step.msg}</Text>
        </Step>
      );
    });
    return steps;
  }
}

const styles = StyleSheet.create({
  stepMsg: {
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
  },
});
