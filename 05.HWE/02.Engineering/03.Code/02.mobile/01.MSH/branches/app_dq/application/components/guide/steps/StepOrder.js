import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from 'rn-easy-button';
import { B } from 'rn-easy-text';

import StepCat from './StepCat';
import Step from './Step';
import Global from '../../../Global';
import { filterMoney } from '../../../utils/Filters';

export default class StepOrder extends Component {
  constructor(props) {
    super(props);
    this.goToPay = this.goToPay.bind(this);
    this.onPayed = this.onPayed.bind(this);
  }

  /**
   * 支付完成回调
   * @param  {[string]} orderId [订单ID]
   * @param  {[boolean]} state  [支付状态]
   * @return {[null]}         [description]
   */
  onPayed(orderId, state) {
    // if (state) { this.toast('付款成功！'); } else { this.toast('付款失败，请稍后再试！'); }
    // this.refresh();
  }

  /**
   * 去缴费
   */
  goToPay(orderId) {
    this.props.navigate({
      routeName: 'Payments',
      params: {
        id: orderId,
        title: '充值缴费',
        showCurrHospitalAndPatient: true,
        allowSwitchHospital: true,
        allowSwitchPatient: true,
        hideNavBarBottomLine: true,
      },
    });
  }

  render() {
    const { item, idx } = this.props;
    return (
      <StepCat item={item} idx={idx} >
        {
          item.steps.map((step, sidx) => {
            const { bizObject } = step;
            const { id, state, amount, charges } = bizObject;
            const msg = state === '1' ? '已缴纳费用共计：' : `您有 ${charges.length} 项待缴费项目共计：`;
            const orderGuidanceMsg = (
              <View style={styles.orderItemsHolder} >
                <Text style={[styles.orderItem, styles.strongText]} >{msg}</Text>
                <Text style={styles.orderItemAmt} >{filterMoney(amount)}</Text>
              </View>
            );
            const payButton = state === '1' ? (
              <Button
                text="缴费详情"
                outline
                size="small"
                style={{ marginTop: 10, width: 80, height: 25 }}
                onPress={() => this.props.navigate({
                  routeName: 'ConsumeMain',
                  params: {
                    title: '消费记录',
                    showCurrHospitalAndPatient: true,
                    allowSwitchHospital: true,
                    allowSwitchPatient: true,
                    hideNavBarBottomLine: true,
                  },
                })}
              />
            ) : (
              <Button
                text="去缴费"
                outline
                size="small"
                style={{ marginTop: 10, width: 80, height: 25 }}
                onPress={() => this.goToPay(id, amount)}
              />
            );
            return (
              <Step key={`step_${idx + 1}_${sidx + 1}`} step={step} >
                {orderGuidanceMsg}
                {
                  charges.map((charge, cidx) => {
                    const height = null;// this.state['order' + step.id]
                    return (
                      <View key={`row_${cidx + 1}`} style={[styles.orderItemsHolder, height]} >
                        <Text style={styles.orderItem} >{charge.name}</Text>
                        <Text style={styles.orderItemAmt} >{filterMoney(charge.receiveAmount)}</Text>
                      </View>
                    );
                  })
                }
                {payButton}
              </Step>
            );
          })
        }
      </StepCat>
    );
  }
}

const styles = StyleSheet.create({
  orderItemsHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  orderItem: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  strongText: {
    color: '#000000',
    fontWeight: '600',
  },
  orderItemAmt: {
    width: 70,
    textAlign: 'right',
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
});
