import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  SectionList,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import ctrlState from '../../../modules/ListState';
import Global from '../../../Global';
import Item from '../../../modules/PureListItem';
import { setMyDefaultProfile, getMyProfiles } from '../../../services/me/PatientService';

class ArchivesList2 extends Component {
  static displayName = 'ArchivesList2';
  static description = '卡号列表';

  static getProfiles(data, edition, hospital) {
    const flag = edition === Global.EDITION_SINGLE ? true : false;
    console.log('data', data);
    const { id } = hospital;
    const sections = [];
    for (let i = 0; i < data.length; i++) {
      const datas = [];
      const pro = data[i].profiles;
      for (let j = 0; j < pro.length; j++) {
        if (flag) {
          if (pro[j].hosId === id) {
            datas.push(pro[j]);
          }
        } else {
          datas.push(pro[j]);
        }
      }
      if (flag) {
        if (data[i].id === id) {
          sections.push({ key: data[i].name, data: datas });
        }
      } else {
        sections.push({ key: data[i].name, data: datas });
      }
    }
    console.log('sections', sections);
    return sections;
  }
  constructor(props) {
    super(props);
    this.callbacking = this.callbacking.bind(this);
    this.bindProfile = this.bindProfile.bind(this);
    this.identify = this.identify.bind(this);
    this.gotoBind = this.gotoBind.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.sectionComp = this.sectionComp.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderDefault = this.renderDefault.bind(this);
    this.renderIdentify = this.renderIdentify.bind(this);
    this.callback = this.callback.bind(this);
  }

  state = {
    profiles: [],
    ctrlState,
    value: this.props.base.currPatient ? this.props.base.currPatient : {},
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.fetchData());
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
    }, () => this.fetchData());
  }

  async fetchData() {
    try {
      const pid = this.state.value ? this.state.value.id : '';
      console.log('id', pid);
      const responseData = await getMyProfiles(pid);
      if (responseData.success) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
        };
        this.setState({
          profiles: responseData.result,
          ctrlState: newCtrlState,
        });
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
        });
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
      this.handleRequestException(e);
    }
  }
  callbacking(item) {
    this.setState({
      profiles: item,
    });
  }
  callback(item) {
    const { callback } = this.props.navigation.state.params;
    if (typeof callback === 'function') callback(item);
  }
  /**
   * 认证
   */
  identify(item) {
    this.props.navigate('Identify2', {
      data: item.item,
      patient: this.state.value,
      callback: this.callbacking,
      title: '卡号认证',
    });
  }

  /**
   * 绑定档案
   * @param item
   */
  bindProfile() {
    this.props.navigate('BindArchives', {
      data: this.state.value,
      callbacks: this.callbacking,
      title: '添加卡号',
    });
  }

  async gotoBind(item) {
    const query = {
      hospitalId: item.item ? item.item.hosId : '',
      profileId: item.item ? item.item.id : '',
      patientId: this.state.value.id ? this.state.value.id : '',
    };
    try {
      // 显示遮罩
      this.props.screenProps.showLoading();
      // 调用后台保存
      const responseData = await setMyDefaultProfile(query);
      if (responseData.success) {
        const data = responseData.result;
        this.setState({
          profiles: data,
        });
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
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

  sectionComp = (info) => {
    const txt = info.section.key;
    return (
      <View style={styles.header}>
        <Text style={styles.headerText} >
          {txt}
        </Text>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={{ flexDirection: 'row', height: 40, paddingTop: 18 }}>
        <Text style={styles.textLeft}>已绑的卡</Text>
        <TouchableOpacity style={styles.headerToch} onPress={this.bindProfile}>
          <Icon name="md-add" size={14} height={14} width={14} color={Global.colors.IOS_BLUE} />
          <Text style={styles.textRight}>添加</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderDefault(status) {
    const txt = status === '1' ? '默认卡号' : '';
    // const tag = status === '1' ? styles.default : null;
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
  renderItem = (item) => {
    console.log('renderItem', item);
    const defaultView = item.item.status === '1' ? (
      <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} />
    ) : (
      <Button text="默认" outline size="small" onPress={() => this.gotoBind(item)} stretch={false} style={{ width: 50, height: 23 }} />
    );
    const identifyView = item.item.identify === '1' ? (
      <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} />
    ) : (
      <Button text="认证" outline size="small" onPress={() => this.identify(item)} stretch={false} style={{ width: 50, height: 23, marginLeft: 6 }} />
    );
    return (
      <Item
        data={item.item}
        chevron={null}
        index={item.index}
        onPress={this.callback}
      >
        <View style={{ flex: 1, flexDirection: 'row' }} >
          <View style={{ flex: 3, flexDirection: 'column' }} >
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.inforMain}>{item.item.name}</Text>
              <Sep width={10} />
              <Text style={[styles.inforMain, { fontSize: 13, fontWeight: '300' }]}>{item.item.gender === '1' ? '男' : '女'}</Text>
            </View>
            <Sep height={8} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>卡号</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.item.no}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>身份证</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.item.idNo}</Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }} >
            <View style={{ flexDirection: 'row', width: 80, justifyContent: 'flex-end' }}>
              {this.renderDefault(item.item.status)}
              <Sep width={5} />
              {this.renderIdentify(item.item.identify)}
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
    const { currHospital, edition } = this.props.base;
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <SectionList
          renderSectionHeader={this.sectionComp}
          renderItem={this.renderItem}
          sections={ArchivesList2.getProfiles(this.state.profiles, edition, currHospital)}
          keyExtractor={(item, index) => (1 + index + item)}
          ItemSeparatorComponent={() => <Sep style={{ height: Global.lineWidth, backgroundColor: Global.colors.LINE, marginLeft: 10, marginRight: 10 }} />}
          ListHeaderComponent={this.renderHeader}
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
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
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
    alignItems: 'center',
  },
  headerText: {
    color: '#000000',
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
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
  headerToch: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inforMain: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    color: '#999999',
    fontSize: 13,
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
  undefault: {
    padding: 2,
    borderRadius: 3,
    fontSize: 9,
    color: 'white',
    backgroundColor: Global.colors.IOS_LIGHT_GRAY,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArchivesList2);
