/**
 * 充值缴费
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from 'rn-easy-button';
// import Sep from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import Form from '../../modules/form/EasyForm';
import Global from '../../Global';
import FormConfig from '../../modules/form/config/LineInputsConfigForPayment';
import { filterMoney } from '../../utils/Filters';

const dismissKeyboard = require('dismissKeyboard');

class OnlineRecharge extends Component {
  static displayName = 'OnlineRecharge';
  static description = '在线充值';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    /* this.getPreStoreInfo = this.getPreStoreInfo.bind(this);
    this.getPrePayInfo = this.getPrePayInfo.bind(this);
    */
    this.toPay = this.toPay.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    doRenderScene: false,
    preStoreBalance: 0.00, // 预存账户余额
    prePayBalance: 0.00, // 预缴账户余额
    amt: 0.00, // 充值金额
    cardType: '0',
    type: '0',
    isPreStore: true,
    showLabel: true,
    labelPosition: 'top',
    billTitle: '预存充值',
    appCode: 'appCode',
    terminalCode: 'zhangsan',
    payerNo: 'lisi',
    bizType: '预存',
    patient: {
      type: '0',
    },
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onChange(name, fValue, formValue) {
    if (name === 'type' && fValue === '0') {
      this.setState({
        cardType: '0',
        patient: formValue,
        isPreStore: true,
      });
      // this.getPreStoreInfo(this.state.profile);
    } else if (name === 'type' && fValue === '1') {
      this.setState({
        cardType: '1',
        patient: formValue,
        isPreStore: false,
      });
      // this.getPrePayInfo(this.state.profile);
    }
    if (name === 'amt') {
      this.setState({
        amt: fValue,
      });
    }
  }

  /*
  *选择常用就诊人之后回调
  *
  */
  toPay() {
    if (this.state.amt && this.state.amt !== 0 && this.state.amt !== '0') {
      this.props.navigates('PayCounter', this.state);
    } else {
      Toast.show('充值金额不能为空且不能为0');
    }
  }

  render() {
    if (!this.state.doRenderScene) {
      return OnlineRecharge.renderPlaceholderView();
    }
    // 场景过渡动画未完成前，先渲染过渡场景

    return (
      <View style={[Global.styles.CONTAINER, {}]}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <View style={{ backgroundColor: 'white', paddingLeft: 20, paddingTop: 15, flexDirection: 'row', alignItems: 'center', height: 30 }} >
              <Text style={{ fontSize: 14, color: Global.colors.FONT_GRAY }}>可用余额</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: Global.colors.IOS_RED, paddingLeft: 15 }}>{this.state.isPreStore ? filterMoney(this.props.dataProps.preStoreBalance) : filterMoney(this.props.dataProps.prePayBalance)}</Text>
            </View>
            <View style={{ paddingLeft: 15, paddingRight: 15 }} >
              <Form
                ref={(c) => { this.form = c; }}
                config={FormConfig}
                showLabel={false}
                labelWidth={100}
                onChange={this.onChange}
                value={this.state.patient}
              >
                <Form.Checkbox
                  name="type"
                  display="row"
                  label=""
                  dataSource={[
                    { label: '门诊充值', value: '0' },
                    { label: '住院预缴', value: '1' },
                  ]}
                  required
                />
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >充值金额</Text>
                <Form.TextInput
                  style={{ height: 76 }}
                  name="amt"
                  label="充值金额:"
                  placeholder="请输入充值金额"
                  dataType="bankAcct"
                  required
                  minLength={6}
                  maxLength={20}
                />
              </Form>
            </View>
            <Button
              style={styles.button}
              text="马上充值"
              onPress={this.toPay}
            />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  margin: {
    marginLeft: 50,
    marginRight: 50,
  },
  button: {
    margin: 15,
    marginTop: 30,
    marginBottom: 40,
  },
});

export default OnlineRecharge;
