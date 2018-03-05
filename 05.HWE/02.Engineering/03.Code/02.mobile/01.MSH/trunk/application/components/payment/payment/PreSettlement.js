/**
 * 用户登录
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Toast from 'react-native-root-toast';
import Separator from 'rn-easy-separator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import { afterLogin, updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';

const dismissKeyboard = require('dismissKeyboard');

const md = require('../../../assets/images/md.jpg');
const mdb = require('../../../assets/images/mdb.jpg');

class PreSettlement extends Component {
  static displayName = 'PreSettlement';
  static description = '预结算';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.toScanner = this.toScanner.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.toBindMD = this.toBindMD.bind(this);
    this.gotoPay = this.gotoPay.bind(this);
  }
  state = {
    doRenderScene: false,
    showSettlement: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '预结算',
      headerRight: (
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={this.toScanner}
        >
          <Icon name="md-expand" size={18} width={18} height={18} />
          <Separator width={5} />
          <Text style={{ color: Global.styles.FONT_GRAY, fontSize: 14, marginRight: 10 }}>
            扫一扫
          </Text>
        </TouchableOpacity>
      ),
    });
  }
  onSuccess(item) {
    console.log('onSuccess.....', item);
    this.setState({
      showSettlement: true,
    });
  }
  toScanner() {
    this.props.navigation.navigate('Scanner', {
      title: '扫描',
      onSuccess: this.onSuccess,
      shouldGoBack: true,
    });
  }
  // 绑定电子医保
  toBindMD() {
    Toast.show('绑定电子社保卡暂未开通');
  }
  gotoPay() {
    Toast.show('该功能暂未开通');
  }
  render() {
    if (!this.state.doRenderScene) { return PreSettlement.renderPlaceholderView(); }
    const txt = this.state.showSettlement ? (
      <Text style={styles.containText}>
        <Text>您已在自助缴费机端登陆！</Text>
        <Text>请在自助缴费机端插入您的社保卡或就诊卡进行缴费操作。</Text>
      </Text>
    ) : (
      <Text style={styles.containText}>
        <Text>您还未绑定电子社保卡，请点击按钮去绑定。</Text>
        <Text>或到就近自助缴费机扫码进行缴费。</Text>
      </Text>
    );
    const settlement = 1 === 2 ? (
      <View>
        <View style={styles.contain}>
          <Text style={styles.containText}>共需支付</Text>
          <Separator width={10} />
          <Text style={styles.containText}>200</Text>
        </View>
        <View style={styles.contain}>
          <Text style={styles.containText}>医保报销</Text>
          <Separator width={10} />
          <Text style={styles.containText}>100</Text>
        </View>
        <View style={styles.contain}>
          <Text style={styles.containText}>医保个人账户支付</Text>
          <Separator width={10} />
          <Text style={styles.containText}>50</Text>
        </View>
        <View style={styles.contain}>
          <Text style={{ fontSize: 14, color: Global.colors.IOS_BLUE }}>还需支付</Text>
          <Separator width={10} />
          <Text style={{ fontSize: 14, color: Global.colors.IOS_BLUE }}>50</Text>
        </View>
        <View style={{ margin: 10, marginBottom: 40 }}>
          <Button text="缴费" onPress={this.gotoPay} />
        </View>
      </View>
    ) : (
      <View>
        <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
          <Icon name="md-alert" size={14} />
          <Separator width={5} />
          {txt}
        </View>
        <View style={{ margin: 10, marginBottom: 40 }}>
          <Button text="绑定电子社保卡" onPress={this.toBindMD} />
        </View>
      </View>
    );
    return (
      <View style={[Global.styles.CONTAINER]}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <Separator height={10} />
            <View style={[Global.styles.CENTER, styles.logoHolder]}>
              <Image source={this.state.showSettlement ? md : mdb} resizeMode="contain" style={styles.logo} />
            </View>
            {settlement}
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
  logoHolder: {
    height: Global.getScreen().height / 4,
  },
  logo: {
    width: (Global.getScreen().width / 2),
    height: (Global.getScreen().height / 4),
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  contain: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
  },
  containText: {
    fontSize: 15,
    color: Global.colors.FONT_LIGHT_GRAY,
    marginRight: 10,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  afterLogin: user => dispatch(afterLogin(user)),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreSettlement);
