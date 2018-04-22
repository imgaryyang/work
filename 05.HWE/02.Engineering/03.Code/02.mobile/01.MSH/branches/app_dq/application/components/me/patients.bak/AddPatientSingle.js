import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  FlatList,
  InteractionManager,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ctrlState from '../../../modules/ListState';
import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import Item from '../../../modules/PureListItem';
import { getMyProfiles, queryProfile, save, updateUserPatients } from '../../../services/me/PatientService';
import { updateUser } from '../../../actions/base/AuthAction';

const dismissKeyboard = require('dismissKeyboard');

class AddPatientSingle extends Component {
  static displayName = 'AddPatientSingle';
  static description = '添加就诊人';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.clear = this.clear.bind(this);
    this.callbacking = this.callbacking.bind(this);
    this.bindProfile = this.bindProfile.bind(this);
    this.identify = this.identify.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    currHospital: (
      this.props.base.currHospital ?
        Object.assign({}, this.props.base.currHospital) : null
    ),
    labelPosition: 'top',
    buttonDisabled: false,
    ctrlState,
    data: [],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  componentWillUnmount() {
  }
  onSearch() {
    // 重新发起按条件查询
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        infiniteLoading: false,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
      data: [],
    }, () => this.fetchData());
  }
  /**
   * 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
   */
  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }
  form = null;

  async fetchData() {
    const query = {
      patientId: this.state.value ? this.state.value.id : '',
      hospitalId: this.state.currHospital ? this.state.currHospital.id : '',
    };
    console.log('query', query);
    try {
      if (typeof query.hospitalId === 'undefined' || query.hospitalId === null || query.hospitalId === '') {
        Toast.show('请先选择医院');
        return;
      }
      // 调用后台保存
      const responseData = await queryProfile(query);
      if (responseData.success) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
        };
        const data = responseData.result;
        this.setState({
          data,
          ctrlState: newCtrlState,
        });
        const res = await updateUserPatients();
        if (res.success) {
          const { user } = this.props.auth;
          const userPatients = res.result;
          user.map = { userPatients };
          this.props.updateUser(user);
        } else {
          this.handleRequestException(res.msg);
        }
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            infiniteLoading: false,
            noMoreData: true,
            requestErr: true,
            requestErrMsg: { msg: responseData.msg },
          },
          data: [],
        });
        Toast.show(responseData.msg);
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      // 隐藏遮罩
      this.handleRequestException(e);
    }
  }
  async submit() {
    if (this.form.validate()) {
      try {
        this.setState({
          buttonDisabled: true,
        });
        // 显示遮罩
        this.props.screenProps.showLoading();
        // 调用后台保存
        const responseData = await save(this.state.value);

        if (responseData.success) {
          this.setState({
            value: responseData.result,
          }, () => this.fetchData());
          this.props.screenProps.hideLoading();
        } else {
          this.setState({
            buttonDisabled: false,
          });
          this.props.screenProps.hideLoading();
          Toast.show(responseData.msg);
        }
      } catch (e) {
        this.setState({
          buttonDisabled: false,
        });
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }
  }

  callbacking(item) {
    console.log('callbacking', item);
    console.log(this);
  }

  /**
   * 绑定档案
   * @param item
   */
  bindProfile() {
    this.props.navigation.navigate('BindArchives', {
      data: this.state.value,
      // callback: this.callbacking(),
    });
  }

  clear() {
    this.setState({ value: {} });
  }
  /**
   * 认证
   */
  identify(item) {
    this.props.navigation.navigate('Identify', {
      data: item,
      hospital: this.state.value,
      patient: this.state.patient,
      callback: this.callbacking,
      title: '卡号认证',
    });
  }
  renderDefault(status) {
    const txt = status === '1' ? '默认卡号' : '';
    const bgColor = status === '1' ? Global.colors.IOS_BLUE : 'white';
    return (
      <View style={[styles.tagContainer, { backgroundColor: bgColor }]} >
        <Text style={styles.tag} >{txt}</Text>
      </View>
    );
  }
  renderIdentify(identify) {
    const txt = identify === '1' ? '已认证' : '未认证';
    // const tag = identify === '1' ? styles.identify : styles.unidentify;
    const bgColor = identify === '1' ? Global.colors.IOS_GREEN : Global.colors.FONT_GRAY;
    return (
      <View style={[styles.tagContainer, { backgroundColor: bgColor }]} >
        <Text style={styles.tag} >{txt}</Text>
      </View>
    );
  }
  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    const defaultView = item.status === '1' ? (
      <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} ></Text>
    ) : (
      <Button text="默认" outline size="small" onPress={() => this.gotoBind(item)} stretch={false} style={{ width: 50 }} />
    );
    const identifyView = item.identify === '1' ? (
      <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} ></Text>
    ) : (
      <Button text="认证" outline size="small" onPress={() => this.identify(item)} stretch={false} style={{ width: 50, marginLeft: 6 }} />
    );
    return (
      <Item
        data={item}
        chevron={null}
        index={index}
      >
        <View style={{ flex: 1, flexDirection: 'row' }} >
          <View style={{ flex: 3, flexDirection: 'column' }} >
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.inforMain}>{item.name}</Text>
              <Sep width={10} />
              <Text style={styles.inforMain}>{item.gender === '1' ? '男' : '女'}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>卡号</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.no}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>身份证</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.idNo}</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }} >
            <View style={{ flexDirection: 'row', width: 80, justifyContent: 'flex-end' }}>
              {this.renderDefault(item.status)}
              <Sep width={5} />
              {this.renderIdentify(item.identify)}
            </View>
            <Sep height={20} />
            <View style={{ flexDirection: 'row', width: 80, justifyContent: 'flex-end' }}>
              {defaultView}
              {identifyView}
            </View>
          </View>
        </View>
      </Item>
    );
  }
  render() {
    if (!this.state.doRenderScene) { return AddPatientSingle.renderPlaceholderView(); }
    console.log('value:', this.state.value);
    console.log('currHospital:', this.state.currHospital);
    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    const relations = [
      { label: '父母', value: '1' },
      { label: '夫妻', value: '2' },
      { label: '子女', value: '3' },
      { label: '其他', value: '4' },
    ];
    return (
      <View style={Global.styles.CONTAINER}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
            <Form
              ref={(c) => { this.form = c; }}
              labelWidth={65}
              onChange={this.onChange}
              value={this.state.value}
              labelPosition={this.state.labelPosition}
            >
              <Form.Checkbox name="relation" label="关系" dataSource={relations} display="row" required />
              <Form.TextInput name="name" label="姓名" placeholder="请输入您的真实姓名" required />
              <Form.Checkbox name="gender" label="性别" dataSource={genders} required />
              <Form.TextInput name="idNo" label="身份证号" placeholder="请输入身份证号码，不允许修改" dataType="cnIdNo" required />
              <Form.TextInput name="mobile" label="手机号码" placeholder="请输入手机号码" dataType="mobile" required />
              <Form.TextInput name="address" label="联系地址" placeholder="请输入联系地址" address />
            </Form>
            <View style={styles.btnHolder} >
              <Button text="重置" onPress={this.clear} theme={Button.THEME.BLUE} />
              <Sep width={10} />
              <Button text="保存" onPress={this.submit} theme={Button.THEME.BLUE} disable={this.state.buttonDisabled} />
            </View>
            {
              this.state.data && this.state.data.length > 0 ? (
                <FlatList
                  data={this.state.data}
                  style={styles.list}
                  keyExtractor={(item, index) => `${item}${index + 1}`}
                  // 渲染行
                  renderItem={this.renderItem}
                  // 渲染行间隔
                  ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
                  // 控制下拉刷新
                  refreshing={this.state.ctrlState.refreshing}
                  onRefresh={this.onSearch}
                  // 无数据占位符
                  ListEmptyComponent={() => {
                    return this.renderEmptyView({
                      msg: '暂无卡号信息',
                      reloadMsg: '点击刷新按钮重新查询',
                      reloadCallback: this.onSearch,
                      ctrlState: this.state.ctrlState,
                    });
                  }}
                  // 列表底部
                  ListFooterComponent={() => {
                    return this.renderFooter({
                      data: this.state.data,
                      ctrlState: this.state.ctrlState,
                    });
                  }}
                />
              ) : null
            }
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
  text: {
    flex: 1,
    textAlign: 'center',
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 0,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    // borderTopWidth: Global.lineWidth,
    // borderTopColor: Global.colors.LINE,
    borderBottomWidth: Global.lineWidth,
    borderBottomColor: Global.colors.LINE,
    backgroundColor: 'white',
    marginTop: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 40,
    color: Global.colors.FONT_GRAY,
    paddingLeft: 15,
  },
  textLeft: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  textRight: {
    textAlign: 'right',
    color: Global.colors.IOS_BLUE,
    marginRight: 10,
  },
  tagsContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  tagContainer: {
    // padding: 3,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 3,
    overflow: 'hidden',
    height: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    fontSize: 9,
    lineHeight: 9,
    color: 'white',
  },
  identify: {
    padding: 2,
    borderRadius: 4,
    fontSize: 9,
    color: 'white',
    backgroundColor: Global.colors.IOS_GREEN,
  },
  unidentify: {
    padding: 2,
    borderRadius: 4,
    fontSize: 9,
    color: 'white',
    backgroundColor: Global.colors.IOS_LIGHT_GRAY,
  },
  default: {
    padding: 2,
    borderRadius: 3,
    fontSize: 9,
    color: 'white',
    backgroundColor: Global.colors.IOS_BLUE,
  },
  undefault: {
    padding: 2,
    borderRadius: 3,
    fontSize: 9,
    color: 'white',
    backgroundColor: Global.colors.IOS_LIGHT_GRAY,
  },
  headerToch: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inforMain: {
    color: '#2C3742',
    fontSize: 15,
  },
  infor: {
    color: '#999999',
    fontSize: 14,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPatientSingle);
