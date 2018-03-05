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

class ArchivesList extends Component {
  static displayName = 'ArchivesList';
  static description = '卡号列表';

  static getProfiles(data) {
    const sections = [];
    for (let i = 0; i < data.length; i++) {
      const datas = [];
      const pro = data[i].profiles;
      for (let j = 0; j < pro.length; j++) {
        datas.push(pro[j]);
      }
      sections.push({ key: data[i].name, data: datas });
    }
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
  }

  state = {
    value: this.props.data ? this.props.data : {},
    profiles: [],
    ctrlState,
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
      const patientId = this.state.value ? this.state.value.id : '';
      const responseData = await getMyProfiles(patientId);
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

  /**
   * 认证
   */
  identify(item) {
    this.props.navigate('Identify2', {
      data: item.item,
      patient: this.state.value,
      callback: this.callbacking,
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
    const tag = status === '1' ? styles.default : null;
    return (
      <View style={styles.tagContainer} >
        <Text style={tag} >{txt}</Text>
      </View>
    );
  }
  renderIdentify(identify) {
    const txt = identify === '1' ? '已认证' : '未认证';
    const tag = identify === '1' ? styles.identify : styles.unidentify;
    return (
      <View style={styles.tagContainer} >
        <Text style={tag} >{txt}</Text>
      </View>
    );
  }
  /**
   * 渲染行数据
   */
  renderItem = (item) => {
    const defaultView = item.item.status === '1' ? (
      <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} ></Text>
    ) : (
      <Button text="默认" outline size="small" onPress={() => this.gotoBind(item)} stretch={false} style={{ width: 50 }} />
    );
    const identifyView = item.item.identify === '1' ? (
      <Text style={{ fontSize: 8, color: Global.colors.ORANGE }} ></Text>
    ) : (
      <Button text="认证" outline size="small" onPress={() => this.identify(item)} stretch={false} style={{ width: 50, marginLeft: 6 }} />
    );
    return (
      <Item
        data={item.item}
        chevron={null}
        index={item.index}
      >
        <View style={{ flex: 1, flexDirection: 'row' }} >
          <View style={{ flex: 3, flexDirection: 'column' }} >
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.inforMain}>{item.item.name}</Text>
              <Sep width={10} />
              <Text style={styles.inforMain}>{item.item.gender === '1' ? '男' : '女'}</Text>
            </View>
            <Sep height={5} />
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
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <SectionList
          renderSectionHeader={this.sectionComp}
          renderItem={this.renderItem}
          sections={ArchivesList.getProfiles(this.state.profiles)}
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
  info: {
    color: '#999999',
    fontSize: 14,
  },
  tagsContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  tagContainer: {
    padding: 2,
    borderRadius: 3,
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
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArchivesList);
