import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  InteractionManager,
} from 'react-native';

import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import ctrlState from '../../../modules/ListState';

import Global from '../../../Global';
import Item from '../../../modules/PureListItem';
import Form from '../../../modules/form/EasyForm';
import { queryProfile, setDefaultProfile, getMyProfiles, updateUserPatients } from '../../../services/me/PatientService';
import { updateUser } from '../../../actions/base/AuthAction';


class BindArchives extends Component {
  static displayName = 'BindArchives';
  static description = '添加档案';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.back = this.back.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.bindProfile = this.bindProfile.bind(this);
    this.chooseHospital = this.chooseHospital.bind(this);
    this.choose = this.choose.bind(this);
    this.gotoBind = this.gotoBind.bind(this);
    this.identify = this.identify.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.renderDefault = this.renderDefault.bind(this);
    this.renderIdentify = this.renderIdentify.bind(this);
    this.callbacking = this.callbacking.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.base.currHospital ?
        Object.assign({}, this.props.base.currHospital) : null
    ),
    patient: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    data: [],
    labelPosition: 'left',
    ctrlState,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.onSearch());
    });
    // this.props.navigation.setParams({
    //   title: '添加卡号',
    // });
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
    }, () => this.submit());
  }
  /**
   * 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
   */
  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue, data: [] });
  }

  form = null;

  async submit() {
    const query = {
      patientId: this.state.patient ? this.state.patient.id : '',
      hospitalId: this.state.value ? this.state.value.id : '',
    };
    console.log('query', query);
    try {
      if (typeof query.hospitalId === 'undefined' || query.hospitalId === null || query.hospitalId === '') {
        Toast.show('请先选择医院');
        return;
      }
      // 显示遮罩
      // this.props.screenProps.showLoading();
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
        const patientId = this.state.patient ? this.state.patient.id : '';
        const response = await getMyProfiles(patientId);
        if (response.success) {
          const pro = this.renderProfile(this.state.value, response.result);
          // 回调列表更新数据
          const { callback } = this.props.navigation.state.params;
          if (typeof callback === 'function') callback(this.state.patient, pro);
          // 回调列表更新数据
          const { callbacks } = this.props.navigation.state.params;
          if (typeof callbacks === 'function') callbacks(response.result);
        } else {
          this.handleRequestException(response.msg);
        }
        const res = await updateUserPatients();
        if (res.success) {
          const { user } = this.props.auth;
          const userPatients = res.result;
          user.map = { userPatients };
          this.props.updateUser(user);
          // this.props.screenProps.hideLoading();
        } else {
          // this.props.screenProps.hideLoading();
          this.handleRequestException(res.msg);
        }
      } else {
        // this.setState({ data: [] });
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
        // this.props.screenProps.hideLoading();
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
      // this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }

  /**
   *  绑定档案
   */
  bindProfile() {
    this.props.navigation.navigate('BindArchives');
  }

  back() {
    this.props.navigation.goBack();
  }
  callbacking(item) {
    this.setState({
      data: item,
    });
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

  choose(item) {
    this.setState({ value: item }, () => this.onSearch());
  }
  chooseHospital() {
    this.props.navigation.navigate('ChooseHospital', {
      chooseHospital: this.choose,
      title: '选择医院',
    });
  }

  /**
   * 绑定档案为默认档案
   * @param item
   * @returns {Promise<void>}
   */
  async gotoBind(item) {
    const query = {
      patientId: this.state.patient ? this.state.patient.id : '',
      profileId: item.id ? item.id : '',
      hospitalId: this.state.value.id ? this.state.value.id : '',
    };
    try {
      // 显示遮罩
      this.props.screenProps.showLoading();
      // 调用后台保存
      const responseData = await setDefaultProfile(query);
      if (responseData.success) {
        const data = responseData.result;
        this.setState({ data });
        const patientId = this.state.patient ? this.state.patient.id : '';
        const response = await getMyProfiles(patientId);
        if (response.success) {
          const pro = this.renderProfile(this.state.value, response.result);
          // 回调列表更新数据
          const { callback } = this.props.navigation.state.params;
          if (typeof callback === 'function') callback(this.state.patient, pro);
          // 回调列表更新数据
          const { callbacks } = this.props.navigation.state.params;
          if (typeof callbacks === 'function') callbacks(response.result);
          // 隐藏遮罩
          this.props.screenProps.hideLoading();
        } else {
          this.props.screenProps.hideLoading();
          Toast.show(response.msg);
        }
      } else {
        this.props.screenProps.hideLoading();
        Toast.show(responseData.msg);
      }
    } catch (e) {
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }

  gotoEdit(item) {
    console.log(item);
    console.log(this);
    this.props.callback();
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
  // 根据医院筛选就诊人
  renderProfile(hospital, hospitals) {
    if (hospitals !== null && hospitals.length > 0 && hospital !== null && hospital.id !== '') {
      for (let j = 0; j < hospitals.length; j++) {
        if (hospital.id === hospitals[j].id) {
          const profiles = hospitals[j].profiles;
          for (let i = 0; i < profiles.length; i++) {
            const pro = profiles[i];
            if (pro.status === '1' && pro.hosId === hospital.id) {
              return pro;
            }
          }
        }
      }
    }
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
    if (!this.state.doRenderScene) { return BindArchives.renderPlaceholderView(); }
    const view = this.props.base.edition === Global.EDITION_SINGLE ? null : (
      <View>
        <Form
          ref={(c) => { this.form = c; }}
          labelWidth={65}
          value={this.state.value}
          labelPosition={this.state.labelPosition}
          showLabel
          style={{ backgroundColor: 'red' }}
        >
          <Form.TextInput
            name="name"
            label="医院"
            showClearIcon={false}
            placeholder="医院名称"
            required
            fontSize={16}
            textAlign="center"
            buttonText="选择医院"
            buttonOnPress={this.chooseHospital}
          />
        </Form>
      </View>
    );
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView style={styles.scrollView}>
          {view}
          <View
            automaticallyAdjustContentInsets={false}
            style={styles.scrollView}
          >
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
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
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

export default connect(mapStateToProps, mapDispatchToProps)(BindArchives);
