import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { B } from 'rn-easy-text';
import Icon from 'rn-easy-icon';

import StepCat from './StepCat';
import Step from './Step';
import Global from '../../../Global';

export default class StepDrug extends Component {
  render() {
    const { item, idx } = this.props;
    return (
      <StepCat item={item} idx={idx} >
        {item.steps.map((step, sidx) => {
          const { bizObject } = step;
          const { deptName, deptAddr, details, state } = bizObject;
          const msg = state === '0' ? `请前往${deptName}等待叫号，领取下列药品：` : `您已从${deptName}领取下列药品：`;
          const drugGuidanceMsg = (
            <View>
              <Text style={[styles.drugItem, styles.strongText]} >{msg}</Text>
              <View style={[styles.addrHolder, Global.styles.CENTER]} >
                <Icon name="ios-pin" size={11} width={18} height={12} color={Global.colors.FONT_LIGHT_GRAY1} />
                <Text style={styles.addr} >{deptAddr}</Text>
              </View>
            </View>
          );
          return (
            <Step key={`step_${idx + 1}_${sidx + 1}`} step={step} >
              {drugGuidanceMsg}
              {details.map((detail, cidx) => {
                const { name, unit, qty } = detail;
                return (
                  <View key={`row_${cidx + 1}`} style={[styles.drugItemsHolder]} >
                    <Text style={styles.drugItem} >{name}</Text>
                    <Text style={styles.drugItemQty} >{qty} {unit}</Text>
                  </View>
                );
              })}
            </Step>
          );
        })}
      </StepCat>
    );
  }
}

const styles = StyleSheet.create({
  drugItemsHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  drugItem: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  drugItemQty: {
    width: 70,
    textAlign: 'right',
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  strongText: {
    color: '#000000',
    fontWeight: '600',
  },
  addrHolder: {
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 7,
  },
  addr: {
    flex: 1,
    fontSize: 10,
    color: Global.colors.FONT_GRAY,
  },
});
