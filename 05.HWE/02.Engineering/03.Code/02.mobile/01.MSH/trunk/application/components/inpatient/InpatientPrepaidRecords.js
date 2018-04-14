/**
 * 住院预缴记录
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import Global from '../../Global';
import ctrlState from '../../modules/ListState';
import Item from '../../modules/PureListItem';
import { filterMoney } from '../../utils/Filters';
import { loadHisInpatientPrepaidRecords } from '../../services/inpatient/InpatientService';

class InpatientPrepaidRecords extends Component {
  static displayName = 'InpatientPrepaidRecords';
  static description = '住院预缴记录';

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
    this.onSearch = this.onSearch.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    ctrlState,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: '住院预缴记录',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
    });
    // const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => {
        this.fetchData(
          this.props.base.currHospital,
          this.props.base.currPatient,
          this.props.base.currProfile,
        );
      });
    });
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.fetchData(
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
        refreshing: true,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => {
      this.fetchData(
        this.props.base.currHospital,
        this.props.base.currPatient,
        this.props.base.currProfile,
      );
    });
  }

  async fetchData(hospital, patient, profile) {
    if (!profile) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: false,
          requestErrMsg: null,
        },
        data: [],
      });
      return;
    }
    try {
      // 获得当前的医院Id
      const hosNo = profile.hosNo;
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
          requestErr: false,
          requestErrMsg: null,
        },
      });
      const profileNo = profile.no;
      /* const query = { proNo: '900000000021', hosNo, startDate, endDate };*/
      const query = { proNo: profileNo, hosNo, tradeChannel: "'Z','W'", type: '0', bizType: '04' };
      // console.log('query=', query);
      const responseData = await loadHisInpatientPrepaidRecords(query);
      if (responseData.success) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
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
    const map = { B: '银行卡预缴', C: '现金预缴', W: '微信预缴', Z: '支付宝预缴' };
    return (
      <Item
        data={item}
        index={index}
        chevron={false}
        style={{
          borderBottomWidth: 1 / Global.pixelRatio,
          borderBottomColor: Global.colors.LINE,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.tradeChannel}>{map[item.tradeChannel] || '未知渠道'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8 }}>
            <Text style={styles.date}>{item.tradeTime ? moment(item.tradeTime).format('YYYY-MM-DD HH:mm:ss') : ''}</Text>
            <Text style={styles.amt}>{filterMoney(item.amt, 2)}&nbsp;元</Text>
          </View>
        </View>
      </Item>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return InpatientPrepaidRecords.renderPlaceholderView();
    }

    const { currProfile } = this.props.base;
    // console.log('this.state.selectDate:', this.state.selectDate);

    const emptyView = !currProfile ? this.renderEmptyView({
      msg: '未选择就诊人',
      ctrlState: this.state.ctrlState,
      style: { marginTop: 15 },
    }) : this.renderEmptyView({
      msg: '未查询到住院预缴信息',
      reloadMsg: '点击刷新按钮重新加载',
      reloadCallback: this.onSearch,
      ctrlState: this.state.ctrlState,
      style: { marginTop: 15 },
    });

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <FlatList
          data={this.state.data}
          ref={(c) => { this.listRef = c; }}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={this.renderItem}
          // ItemSeparatorComponent={() => (<Sep height={15} style={{ backgroundColor: Global.colors.IOS_GRAY_BG }} />)}
          // 控制下拉刷新
          refreshing={this.state.ctrlState.refreshing}
          onRefresh={this.onSearch}
          ListEmptyComponent={emptyView}
          // ListFooterComponent={() => (<View style={{ height: 15 }} />)}
          style={styles.flatList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.NAV_BAR_LINE,
    flexDirection: 'row',
    height: 30,
    // paddingLeft: 15,
  },
  tradeChannel: {
    fontSize: 13,
    color: 'black',
  },

  date: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  amt: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'right',
  },
});

const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps, null)(InpatientPrepaidRecords);
