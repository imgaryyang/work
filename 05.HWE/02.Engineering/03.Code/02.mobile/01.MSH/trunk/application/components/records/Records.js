/**
 * 就诊记录
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-root-toast';

import Global from '../../Global';
import { list } from '../../services/records/RecordService';
import ctrlState from '../../modules/ListState';
import Item from '../../modules/PureListItem';
import Tags from '../../modules/filters/Tags';

class Records extends Component {
  static displayName = 'Records';
  static description = '就诊记录';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.gotoScan = this.gotoScan.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    ctrlState,
    profile: {},
  };

  componentDidMount() {
    const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.getProfile());
    });
    this.props.navigation.setParams({
      title: '就诊记录',
      showCurrHospitalAndPatient: !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
    });
  }

  // 搜索
  onSearch() {
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
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
  /**
   * 获取用户信息的基本判断
   */
  getProfile() {
    const { currHospital, currProfile } = this.props.base;
    if ((currHospital == null) || (currHospital === undefined)) {
      Toast.show('未选择当前医院！');
      return null;
    } else if (currProfile === null) {
      Toast.show('当前就诊人无档案！');
      return null;
    } else if (currProfile.status !== '1' || currProfile.hosId !== currHospital.id) {
      Toast.show('当前就诊人在当前医院暂无档案！');
      return null;
    } else {
      this.setState({
      }, () => this.fetchData());
    }
  }
  gotoScan(item) {
    this.props.navigation.navigate('RecordDetails', {
      data: item,
      title: '诊疗详情',
      hideNavBarBottomLine: false,
    });
  }
  afterChooseHospital(hospital) {
    this.getProfile(hospital, this.props.base.currPatient);
  }
  afterChoosePatient(patient, profile) {
    if (typeof profile !== 'undefined' && profile !== null) {
      this.setState({
      }, () => this.fetchData());
    }
  }
  async fetchData() {
    try {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      const responseData = await list(this.props.base.currProfile);
      if (responseData.success) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
        };
        this.setState({
          data: responseData.result,
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
        this.handleRequestException({ msg: responseData.msg });
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

  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    // console.log('item>>>>', item);
    const { tagConfig } = Global.Config;
    const tags = [item.clinicTypeName ? { ...tagConfig.clinicTypeOther, label: item.clinicTypeName } : tagConfig.clinicTypeNormal];
    return (
      <Item
        data={item}
        index={index}
        onPress={this.gotoScan}
      >
        <View style={{ flex: 1 }} >
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.date}>{moment(item.createTime).format('YYYY-MM-DD hh:mm')}</Text>
            <Tags tags={tags} containerStyle={{ marginLeft: 10 }} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.mainText}>{item.docName}
              <Text style={styles.jobTitle}>{item.docJobTitle ? `（ ${item.docJobTitle} ）` : ''}</Text>
            </Text>
            <Text style={[styles.mainText, { textAlign: 'right' }]}>{item.depName}</Text>
          </View>
          <View>
            <Text style={styles.diagnosis}>{`诊断：${item.diagnosis || '暂无诊断信息'}`}</Text>
          </View>
        </View>
      </Item>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return Records.renderPlaceholderView();
    }
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
            data={this.state.data}
            ref={(c) => { this.listRef = c; }}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            renderItem={this.renderItem}
            ItemSeparatorComponent={() => (<Sep height={15} />)}
            // 控制下拉刷新
            refreshing={this.state.ctrlState.refreshing}
            onRefresh={this.onSearch}
            ListEmptyComponent={() => {
              return this.renderEmptyView({
                msg: '暂无信息',
                reloadMsg: '点击刷新按钮重新加载',
                reloadCallback: this.onSearch,
                ctrlState: this.state.ctrlState,
              });
            }}
            // 列表底部
            ListFooterComponent={() => {
              return this.renderFooter({
                data: this.state.data,
                ctrlState: this.state.ctrlState,
                callback: this.onInfiniteLoad,
              });
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    borderBottomWidth: 1,
    borderBottomColor: Global.colors.LINE,
  },
  date: {
    fontSize: 12,
    color: Global.colors.FONT_LIGHT_GRAY,
  },
  mainText: {
    flex: 1,
    marginTop: 8,
    fontSize: 14,
    // fontWeight: '600',
    color: 'black',
  },
  jobTitle: {
    fontSize: 11,
    color: Global.colors.FONT_GRAY,
  },
  diagnosis: {
    marginTop: 8,
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
  },
});

const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps, null)(Records);
