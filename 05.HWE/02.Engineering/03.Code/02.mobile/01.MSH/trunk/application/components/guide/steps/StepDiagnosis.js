import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from 'rn-easy-button';

import StepCat from './StepCat';
import Step from './Step';
import Global from '../../../Global';

export default class StepDiagnosis extends Component {
  render() {
    const { item, idx } = this.props;
    return (
      <StepCat item={item} idx={idx} >
        {item.steps.map((step, sidx) => {
          let content = null;
          if (step.bizObject.type === 'signin') {
            const { state } = step.bizObject;
            if (state === '0') {
              content = (
                <View >
                  <Text style={styles.stepMsg} >{step.bizObject.description}</Text>
                  <Button
                    text="去签到"
                    outline
                    size="small"
                    style={{ marginTop: 10, width: 80, height: 25 }}
                    onPress={() => this.props.navigate({
                      routeName: 'SignIn',
                      params: {
                        title: '来院签到',
                        showCurrHospitalAndPatient: true,
                        allowSwitchHospital: true,
                        allowSwitchPatient: true,
                      },
                    })}
                  />
                </View>
              );
            } else {
              content = (
                <Text style={styles.stepMsg} >{step.bizObject.description}</Text>
              );
            }
          } else if (step.bizObject.type === 'diagnosis') {
            const { state, deptAddr, deptName, doctorName, diagnosis } = step.bizObject;
            if (state === '0') { // 未看诊
              content = (
                <Text style={styles.stepMsg} >请到{deptAddr}{deptName}门口候诊。</Text>
              );
            } else {
              content = (
                <Text style={styles.stepMsg} >{doctorName}医生完成看诊，诊断结果为：{diagnosis}。</Text>
              );
            }
          }
          return (
            <Step key={`row_${sidx + 1}`} step={step} >
              {content}
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
  addrHolder: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addr: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
});
