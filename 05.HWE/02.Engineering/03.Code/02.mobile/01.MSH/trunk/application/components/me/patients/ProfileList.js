import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import Button from 'rn-easy-button';
import Card from 'rn-easy-card';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import { bindProfile } from '../../../services/me/PatientService';
import { spaceAfterThreeLetters } from '../../../utils/Filters';
import Form from '../../../modules/form/EasyForm';
import { testMobile } from '../../../modules/form/Validation';
import { sendSecurityCode, verifySecurityCode } from '../../../services/base/BaseService';

const cardBg = 'white';
const dismissKeyboard = require('dismissKeyboard');

class ProfileList extends Component {
  static displayName = 'ProfileList';
  static description = '卡号列表';

  constructor(props) {
    super(props);
    this.initBindedCards = this.initBindedCards.bind(this);
    this.bind = this.bind.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setClock = this.setClock.bind(this);
    this.sendSecurityCode = this.sendSecurityCode.bind(this);

    this.initBindedCards();
  }

  state = {
    visible: false,
    value: {},
    buttonDisabled: false,
    sendButtonDisabled: false,
    second: Global.Config.global.authCodeResendInterval,
  };

  componentDidMount() {
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  setClock() {
    const interval = Global.Config.global.authCodeResendInterval;
    if (this.state.second === 0) {
      this.setState({ second: interval });
      return;
    }

    const second = this.state.second ? this.state.second - 1 : interval;
    this.clockTimer = setTimeout(
      () => {
        this.setState({ second });
        this.setClock();
      },
      1000,
    );
  }

  bindedCards = {};
  form = null;
  timer = null;
  clockTimer = null;

  /**
   * 发送验证码
   * @returns {Promise<boolean>}
   */
  async sendSecurityCode() {
    // console.log('in send auth sm');
    const { value } = this.state;
    if (!value.mobile) {
      this.form.mobile.showError('该就诊人在医院未预留手机号，不能进行绑卡！');
      return false;
    } else if (!testMobile(value.mobile)) {
      this.form.mobile.showError('您输入的手机号不符合要求，请重新输入！');
      return false;
    } else {
      this.form.mobile.showError('');
      try {
        this.setState({ sendButtonDisabled: true });
        const responseData = await sendSecurityCode({
          type: Global.securityCodeType.BIND_PROFILE,
          mobile: value.mobile,
        });
        // console.log('responseData of sendSecurityCode:', responseData);
        if (responseData.success) {
          // Toast.show('验证码发送成功，请注意查收！');
          this.form.securityCode.showError('验证码发送成功，请注意查收！');
          this.setState({ sendButtonDisabled: true }, () => {
            this.setClock();
            this.timer = setTimeout(
              () => {
                this.setState({ sendButtonDisabled: false });
              },
              30000,
            );
          });
        } else {
          // Toast.show(responseData.msg);
          this.form.securityCode.showError(responseData.msg);
          this.setState({ sendButtonDisabled: false });
        }
      } catch (e) {
        this.setState({ sendButtonDisabled: false });
        this.handleRequestException(e);
      }
    }
  }

  initBindedCards() {
    const { patientId } = this.props;
    const patient = this.props.screenProps.getPatientById(patientId);
    const { profiles } = patient;
    for (let i = 0; i < profiles.length; i++) {
      const key = `${profiles[i].hosId}${profiles[i].no}`;
      this.bindedCards[key] = key;
    }
  }

  async bind() {
    const { patientId } = this.props;
    if (this.form.validate()) {
      try {
        const { value } = this.state;
        this.setState({
          buttonDisabled: true,
          sendButtonDisabled: true,
        });
        // this.props.screenProps.showLoading();
        const responseData = await verifySecurityCode({
          type: Global.securityCodeType.BIND_PROFILE,
          mobile: value.mobile,
          code: value.securityCode,
          // hospitalId: value.hosId,
          // id: msg.id,
        });
        // console.log('responseData of verifySecurityCode:', responseData);
        if (responseData.success) {
          // Toast.show(`验证码验证成功${'\n'}正在绑卡，请稍候...`);
          this.form.securityCode.showError('验证码验证成功。正在绑卡，请稍候...');
          const bindResponse = await bindProfile({
            hospitalId: value.hosId,
            patientId,
            profiles: this.props.profiles,
            token: responseData.result.token,
          });
          // console.log('bindResponse:', bindResponse);
          if (bindResponse.success) {
            this.form.securityCode.showError('绑卡成功！');
            this.setState({ visible: false }, () => {
              this.props.screenProps.reloadUserInfo();
              this.props.navigation.goBack();
            });
          } else {
            this.setState({
              buttonDisabled: false,
              sendButtonDisabled: false,
            });
            // this.props.screenProps.hideLoading();
            // Toast.show(bindResponse.msg);
            this.form.securityCode.showError(bindResponse.msg);
          }
        } else {
          this.setState({
            buttonDisabled: false,
            sendButtonDisabled: false,
          });
          // this.props.screenProps.hideLoading();
          // Toast.show(responseData.msg);
          this.form.securityCode.showError(responseData.msg);
        }
      } catch (e) {
        this.setState({
          buttonDisabled: false,
          sendButtonDisabled: false,
        });
        // this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }
  }

  renderModal() {
    return (
      <Modal
        isVisible={this.state.visible}
        onBackdropPress={() => this.setState({ visible: false })}
        animationIn="slideInDown"
      >
        <Card radius={5} noPadding style={{ padding: 5 }}>
          <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
            <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
              <Form
                ref={(c) => { this.form = c; }}
                onChange={this.onChange}
                value={this.state.value}
                showLabel={false}
              >
                <Form.TextInput
                  label="医院预留手机号"
                  name="mobile"
                  dataType="mobile"
                  placeholder="医院预留手机号"
                  required
                  icon="ios-phone-portrait"
                  editable={false}
                />
                <Form.TextInput
                  label="验证码"
                  name="securityCode"
                  placeholder="请输入短信验证码"
                  autoFocus
                  dataType="number"
                  maxLength={6}
                  minLength={6}
                  textAlign="center"
                  required
                  icon="ios-chatbubbles"
                  buttonText={`点击免费${'\n'}获取验证码`}
                  buttonOnPress={this.sendSecurityCode}
                  buttonDisabled={this.state.sendButtonDisabled}
                  buttonDisabledText={`${this.state.second}秒钟后可${'\n'}再次发送`}
                />
              </Form>
              <Button
                text="绑定"
                onPress={this.bind}
                disabled={this.state.buttonDisabled}
                style={styles.btn}
                outline
                stretch={false}
              />
            </KeyboardAwareScrollView>
          </TouchableWithoutFeedback>
        </Card>
      </Modal>
    );
  }

  /**
   * 渲染行数据
   */
  renderItems() {
    const { profiles, allowBind, showPatientInfo } = this.props;
    return profiles.map((item, idx) => {
      const { id, hosId, hosName, no, name, idNo, mobile } = item;
      // const cardHeader = idx === 0 ? (
      //   <View style={styles.cardHeader} />
      // ) : (
      //   <View style={styles.cardHeaderWrapper}>
      //     <View style={[styles.cardHeader]} />
      //   </View>
      // );
      // const cardFooter = idx === profiles.length - 1 ? (
      //   <View style={styles.cardFooter} />
      // ) : null;

      const key = `${hosId}${no}`;
      const bindBtn = allowBind ? (!this.bindedCards[key] ? (
        <TouchableOpacity style={styles.bindBtn} onPress={() => this.setState({ visible: true, value: { ...item, securityCode: '' } })}>
          <Text style={styles.bindText}>绑定</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.bindedText}>已绑定</Text>
      )) : null;

      const patientInfo = showPatientInfo ? (
        <View style={styles.patientContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.idNo} numberOfLines={1}>{idNo}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            <Text style={styles.name} numberOfLines={1}>医院预留手机号：</Text>
            <Text style={styles.idNo} numberOfLines={1}>{mobile}</Text>
          </View>
        </View>
      ) : null;

      return (
        <Card radius={6} fullWidth={false} key={`card_${id}_${idx + 1}`} style={styles.cardContainer}>
          <View style={styles.cardBody}>
            <View style={styles.hospitalContainer}>
              <Text style={styles.hospName} numberOfLines={1}>{hosName}</Text>
              {bindBtn}
            </View>
            <Text style={styles.cardNo} numberOfLines={1}>{spaceAfterThreeLetters(no)}</Text>
            {patientInfo}
          </View>
          {this.renderModal()}
        </Card>
      );
    });
  }

  render() {
    return (
      <View style={styles.profilesContainer}>
        {this.renderItems()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profilesContainer: {
    padding: 10,
  },

  cardContainer: {
    // // shadow for ios
    // shadowColor: '#dddddd',
    // shadowOffset: { width: 0, height: -3 },
    // shadowOpacity: 0.6,
    // shadowRadius: 2,
    // // for android
    // elevation: -3,
    marginBottom: 10,
  },
  // cardHeaderWrapper: {
  //   backgroundColor: cardBg,
  //   // height: 35,
  //   paddingTop: 15,
  //   borderWidth: 1 / Global.pixelRatio,
  //   borderColor: Global.colors.LINE,
  //   borderTopWidth: 0,
  //   borderBottomWidth: 0,
  // },
  // cardHeader: {
  //   // position: 'absolute',
  //   // top: 15,
  //   // left: 0,
  //   // width: '100%',
  //   height: 20,
  //   backgroundColor: cardBg,
  //   borderTopLeftRadius: 8,
  //   borderTopRightRadius: 8,
  //   borderWidth: 1 / Global.pixelRatio,
  //   borderColor: Global.colors.LINE,
  //   borderBottomWidth: 0,
  //   // marginTop: 5,
  //   // shadow for ios
  //   // shadowColor: 'black',
  //   // shadowOffset: { width: 0, height: -1 },
  //   // shadowOpacity: 0.6,
  //   // shadowRadius: 2,
  //   // for android
  //   // elevation: -3,
  // },
  // cardFooter: {
  //   backgroundColor: cardBg,
  //   height: 20,
  //   borderBottomLeftRadius: 8,
  //   borderBottomRightRadius: 8,
  //   borderWidth: 1 / Global.pixelRatio,
  //   borderColor: Global.colors.LINE,
  //   borderTopWidth: 0,
  // },

  cardBody: {
    backgroundColor: cardBg,
  },
  hospitalContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospName: {
    flex: 1,
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  bindBtn: {
    borderWidth: 1 / Global.pixelRatio,
    borderColor: Global.colors.IOS_BLUE,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
  },
  bindText: {
    color: Global.colors.IOS_BLUE,
    fontSize: 12,
  },
  bindedText: {
    color: Global.colors.FONT_LIGHT_GRAY1,
    fontSize: 12,
  },
  cardNo: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  patientContainer: {
    marginTop: 8,
    marginBottom: 0,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'rgba(0,122,255,.1)',
    alignItems: 'center',
    borderRadius: 4,
  },
  name: {
    color: Global.colors.FONT_GRAY,
    fontSize: 10,
    fontWeight: '600',
  },
  idNo: {
    flex: 1,
    color: Global.colors.FONT_GRAY,
    fontSize: 10,
    textAlign: 'right',
  },

  btn: {
    height: 40,
    margin: 10,
    marginTop: 0,
  },
});

ProfileList.propTypes = {
  profiles: PropTypes.array.isRequired,
  screenProps: PropTypes.object.isRequired,
  patientId: PropTypes.string.isRequired,
  allowBind: PropTypes.bool,
  showPatientInfo: PropTypes.bool,
  // ctrlState: PropTypes.object,
};

ProfileList.defaultProps = {
  // ctrlState,
  allowBind: false,
  showPatientInfo: false,
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

// const mapDispatchToProps = dispatch => ({
//   navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
// });

export default connect(mapStateToProps/* , mapDispatchToProps*/)(ProfileList);
