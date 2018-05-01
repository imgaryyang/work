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
    this.props.navigation.setParams({
      title: '就诊记录查询',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      // afterChooseHospital: this.afterChooseHospital,
      // afterChoosePatient: this.afterChoosePatient,
    });
    // const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => {
        this.getProfile(
          this.props.base.currHospital,
          this.props.base.currPatient,
          this.props.base.currProfile,
        );
      });
    });
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.getProfile(
        props.base.currHospital,
        props.base.currPatient,
        props.base.currProfile,
      );
    }
  }
  // 搜索
  onSearch() {
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
    // 重新发起按条件查询
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        // infiniteLoading: false,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => {
      this.getProfile(
        this.props.base.currHospital,
        this.props.base.currPatient,
        this.props.base.currProfile,
      );
    });
  }
  /**
   * 获取用户信息的基本判断
   */
  getProfile(currHospital, currPatient, currProfile) {
    if (currHospital === null || currProfile === null) {
      currHospital = this.props.base.currHospital;
      currProfile = this.props.base.currProfile;
    }
    if (!currProfile) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: false,
          requestErrMsg: null,
        },
        data: {},
      });
      return;
    }
    this.setState({
    }, () => this.fetchData(currHospital, currPatient, currProfile));
  }
  gotoScan(item) {
    this.props.navigation.navigate('RecordDetails', {
      data: item,
      title: '诊疗详情',
      hideNavBarBottomLine: false,
    });
  }
  afterChooseHospital(hospital) {
    // this.getProfile(hospital, this.props.base.currPatient);
  }
  afterChoosePatient(patient, profile) {
    // if (typeof profile !== 'undefined' && profile !== null) {
    //   this.setState({
    //   }, () => this.fetchData());
    // }
  }
  async fetchData(currHospital, currPatient, currProfile) {
    try {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
          requestErr: false,
          requestErrMsg: '',
        },
      });
      const responseData = await list(currProfile);
      if (responseData.success) {
        // 隐藏遮罩
        // this.props.screenProps.hideLoading();
        this.setState({
          data: responseData.result,
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            requestErr: false,
            requestErrMsg: '',
          },
        });
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            noMoreData: true,
            requestErr: true,
            requestErrMsg: { status: 600, msg: responseData.msg },
          },
        });
        this.handleRequestException({ status: 600, msg: responseData.msg });
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          // infiniteLoading: false,
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
            <Text style={styles.date}>{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</Text>
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
                style: { marginTop: 15 },
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
