/**
 * 化验单详情
 */

import React, { Component, PureComponent } from 'react';

import {
  InteractionManager,
  StyleSheet,
  View,
  FlatList,
  Text, Alert,
} from 'react-native';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';
import config from '../../../Config';
import Global from '../../Global';
import ctrlState from '../../modules/ListState';
import { hisTestDetailList } from '../../services/reports/TestService';

class Item extends PureComponent {
  render() {
    const detail = this.props.data;
    const color = detail.flag === '0' ? 'black' : detail.flag === '1' ? 'red' : '#6CD809';
    return (
      <View style={styles.renderRow} >
        <View style={styles.rowName}>
          <Text style={styles.name}>{detail.subject || ''}</Text>
          <Sep height={3 / Global.pixelRatio} />
          {detail.reference !== null ? (<Text style={styles.reference}>参考值：{detail.reference || ''} {detail.unit || ''}</Text>) : null}
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.result, { color: `${color}` }]}>{detail.result || ''}</Text>
        </View>
        <View style={{ flex: 2 }}>
          {detail.flag === '0' ? null : detail.flag === '1' ? (<Icon name="ios-arrow-round-up" size={33} color="red" />) :
            (<Icon name="ios-arrow-round-down" size={33} color="#6CD809" />)}
        </View>
      </View>
    );
  }
}

class LisDetail extends Component {
  static displayName = 'LisDetail';
  static description = '化验单明细';

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
    this.renderItem = this.renderItem.bind(this);
    this.loadCheckDetail = this.loadCheckDetail.bind(this);
  }

  state = {
    doRenderScene: false,
    data: this.props.navigation.state.params.data ? this.props.navigation.state.params.data : [],
    ctrlState,
  };
  componentWillMount() {
    // this.loadCheckDetail();
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.props.navigation.setParams({
      title: '化验单详情',
    });
  }

  async loadCheckDetail() {
    try {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
          infiniteLoading: false,
          noMoreData: false,
          requestErr: false,
          requestErrMsg: null,
        },
      });
      const barCode = this.props.navigation.state.params.barcode;
      const query = { testId: barCode };
      const responseData = await hisTestDetailList(query);
      if (responseData.success === true) {
        // 隐藏遮罩
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
        };
        this.setState({ data: responseData.result, ctrlState: newCtrlState });
      } else {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          requestErr: true,
          requestErrMsg: { msg: responseData.msg },
        };
        this.setState({ ctrlState: newCtrlState });
        this.handleRequestException({ status: 600, msg: responseData.msg });
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
      // 隐藏遮罩
      // this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }
  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
      />
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return LisDetail.renderPlaceholderView();
    }
    const name = this.props.navigation.state.params.checkName;

    const LISDesc = config.LISDesc;
    let desc = '';
    if (name === '血常规') {
      desc = LISDesc['bloodRT'];
    } else if (name === '肝功能检查') {
      desc = LISDesc['liverFunction'];
    } else if (name === '尿常规') {
      desc = LISDesc['UrineRT'];
    } else {
      desc = '暂无相关介绍';
    }
    return (
      <View style={styles.container} >

        <View style={styles.title}>
          <Text style={styles.itemName}>{name || '-'}</Text>
          <Text style={styles.introduce}>{desc}</Text>
        </View>
        <View style={styles.checkTitle}>
          <Text style={[styles.titleText, { marginLeft: 20, flex: 4 }]}>项目</Text>
          <Text style={[styles.titleText, { flex: 1, paddingLeft: 10 }]}>结果</Text>
          <Text style={[styles.titleText, { flex: 1, paddingLeft: 40 }]}>状态</Text>
        </View>
        <FlatList
          data={this.state.data}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={this.renderItem}
          // 控制下拉刷新
          refreshing={this.state.ctrlState.refreshing}
          onRefresh={this.loadCheckDetail}
          // ItemSeparatorComponent={() => (<View style={Global.styles.FULL_SEP_LINE} />)}
          ListEmptyComponent={() => {
            return this.renderEmptyView({
              msg: '暂无符合查询条件的报告单信息',
              reloadMsg: '点击刷新按钮重新查询',
              reloadCallback: this.loadCheckDetail,
              ctrlState: this.state.ctrlState,
            });
          }}
          ListFooterComponent={() => (<View style={{ backgroundColor: 'white', height: 150 }} />)}
        />


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Global.getScreen().width,
    backgroundColor: Global.colors.IOS_GRAY_BG,
    height: Global.getScreen().height,
    overflow: 'hidden',
  },
  title: {
    width: Global.getScreen().width,
    height: 93,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  checkTitle: {
    marginTop: 8,
    width: Global.getScreen().width,
    height: 30,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 12,
    color: '#999999',
  },
  itemName: {
    paddingTop: 8,
    paddingLeft: 10,
    fontSize: 13,
    color: 'black',
    width: Global.getScreen().width,
  },
  introduce: {
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 12,
    color: '#999999',
    width: Global.getScreen().width,
    lineHeight: 15,
  },
  renderRow: {
    flexDirection: 'row',
    marginTop: 1,
    width: Global.getScreen().width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  name: {
    marginLeft: 10,
    fontSize: 13,
    color: 'black',
    lineHeight: 15,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Global.getScreen().width,
    height: 40,
    backgroundColor: 'white',
  },
  rowName: {
    flex: 6,
  },
  reference: {
    marginLeft: 10,
    color: '#999999',
    lineHeight: 15,
    fontSize: 12,
  },
  result: {
    paddingLeft: 10,
    fontSize: 13,
  },
  state: {
    paddingLeft: 25,
    fontSize: 13,
  },
});

export default LisDetail;
