import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import StepCat from './StepCat';
import Step from './Step';
import Global from '../../../Global';

export default class StepRegister extends Component {
  render() {
    const { item, idx } = this.props;
    return (
      <StepCat item={item} idx={idx} >
        {item.steps.map((step, sidx) => {
          return (
            <Step key={`s_${idx + 1}_${sidx + 1}`} step={step} >
              <Text style={styles.stepMsg} >{step.bizObject.description}</Text>
            </Step>
          );
        })}
      </StepCat>
    );
  }
}

const styles = StyleSheet.create({
  stepMsg: {
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
  },
});
