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
      }, () => this.getProfile(this.props.base.currHospital, this.props.base.currPatient));
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
  getProfile(hospital, patient) {
    if (hospital !== null && patient !== null) {
      const { profiles } = patient;
      if (profiles !== null) {
        const length = profiles.length ? profiles.length : 0;
        for (let i = 0; i < length; i++) {
          const pro = profiles[i];
          if (pro.status === '1' && pro.hosId === hospital.id) {
            this.setState({
              profile: pro,
            }, () => this.fetchData());
          }
        }
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            requestErrMsg: '当前就诊人在当前医院暂无档案！',
          },
        });
        Toast.show('当前就诊人在当前医院暂无档案！');
        return null;
      }
    }
  }
  gotoScan(item) {
    this.props.navigation.navigate('RecordDetails', {
      data: item,
    });
  }
  afterChooseHospital(hospital) {
    this.getProfile(hospital, this.props.base.currPatient);
  }
  afterChoosePatient(patient, profile) {
    if (typeof profile !== 'undefined' && profile !== null) {
      this.setState({
        profile,
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
      const responseData = await list(this.state.profile);
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
    console.log('item>>>>', item);
    const line = (<View
      style={{
        width: Global.getScreen().width, height: 1 / Global.pixelRatio, backgroundColor: Global.colors.LINE,
      }}
    />);
    return (
      <Item
        data={item}
        index={index}
        onPress={this.gotoScan}
      >
        <View style={{ flex: 1 }} >
          <Text>{moment(item.createTime).format('YYYY-MM-DD hh:mm')}</Text>
          <View style={{ paddingTop: 12, paddingBottom: 15 }} >
            {line}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>科室</Text>
            <Sep width={10} />
            <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.depName}</Text>
          </View>
          <Sep height={5} />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>医生</Text>
            <Sep width={10} />
            <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.docName}</Text>
          </View>
          <Sep height={5} />
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>类型</Text>
            <Sep width={10} />
            <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.clinicTypeName ? item.clinicTypeName : '普通门诊'}</Text>
          </View>
          <Sep height={5} />
          <View style={{ flexDirection: 'row', paddingBottom: 15 }}>
            <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>主诉</Text>
            <Sep width={10} />
            <View style={{ paddingRight: 10 }}>
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.complaint}</Text>
            </View>
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
  titleText: {
    fontSize: 19,
    color: Global.colors.FONT,
    // fontWeight: 'bold',
    // textAlign: 'center',
  },
  addText: {
    fontSize: 12,
    color: Global.colors.FONT_LIGHT_GRAY1,
  },
  text: {
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
  },
});

const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps, null)(Records);
