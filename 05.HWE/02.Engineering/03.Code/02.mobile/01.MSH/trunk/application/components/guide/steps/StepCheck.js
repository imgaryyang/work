import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import Button from 'rn-easy-button';

import StepCat from './StepCat';
import Step from './Step';
import Global from '../../../Global';

export default class StepCheck extends Component {
  constructor(props) {
    super(props);
    this.checkReport = this.checkReport.bind(this);
  }
  /**
   * 查看检查单
   */
  checkReport(checkId) {
    this.props.navigate({
      routeName: 'Reports',
      params: { id: checkId },
    });
  }

  render() {
    const { item, idx } = this.props;
    const steps = item.steps.map((step, sidx) => {
      const c = step.bizObject;
      const state = c.state ? c.state : 0;
      let stateContainer = null;
      if (state === '0') stateContainer = <Text style={styles.checkstate} >未检查</Text>;
      else if (state === '1') stateContainer = <Text style={styles.checkstate} >未出结果</Text>;
      else if (state === '2') {
        stateContainer = (
          <Text style={[styles.checkstate, { color: Global.colors.IOS_BLUE, fontWeight: '600' }]} onPress={() => this.checkReport(c.id)} >查看详情</Text>
        );
      }
      return (
        <Step key={`row_${sidx + 1}`} step={step} >
          <View style={styles.checksHolder} >
            <Text style={styles.checkName} >{c.name}</Text>
            {stateContainer}
          </View>
        </Step>
      );
    });
    return (
      <StepCat item={item} idx={idx} >
        {steps}
      </StepCat>
    );
  }
}

const styles = StyleSheet.create({
  checksHolder: {
    flexDirection: 'row',
  },
  checkName: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  checkstate: {
    width: 70,
    textAlign: 'right',
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
});
