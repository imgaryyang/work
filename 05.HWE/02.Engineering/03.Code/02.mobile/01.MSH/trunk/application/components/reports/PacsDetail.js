/**
 * 检查单详情
 */

import React, { Component } from 'react';
import Sep from 'rn-easy-separator';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text, ScrollView, Alert,
} from 'react-native';
import Global from '../../Global';
import Icon from 'rn-easy-icon';
import Button from 'rn-easy-button';
import { hisPacsDetail } from '../../services/reports/TestService';


class PacsDetail extends Component {
  static displayName = 'PacsDetail';
  static description = '特检单详情';
  constructor(props) {
    super(props);
    this.loadPacsDetail = this.loadPacsDetail.bind(this);
  }
  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  state = {
    doRenderScene: false,
    data: {},
    barCode: '',
  };
  componentDidMount() {
    const data = this.props.navigation.state.params.data;
    const barCode = this.props.navigation.state.params.barcode;
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        data,
        barCode,
      });
    });
    this.props.navigation.setParams({
      title: '特检单详情',
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <Button
            onPress={this.loadPacsDetail}
            clear
            stretch={false}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <Icon iconLib="mi" name="cached" size={18} width={26} height={35} color={Global.colors.FONT_GRAY} />
            <Text style={{ color: Global.colors.FONT_GRAY, fontSize: 12 }}>刷新</Text>
          </Button>
        </View>
      ),
    });
  }
  async loadPacsDetail() {
    // console.log("loadPacsDetail===this.state.barcode=====",this.state.barCode);
    try {
      const barCode = this.state.barCode;
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
          requestErr: false,
          requestErrMsg: null,
        },
      });
      // pacs 明细数据
      const query = { barCode };
      const pacsResponseData = await hisPacsDetail(query);
      // console.log('pacsResponseData==', pacsResponseData);
      if (pacsResponseData.success === true) {
        // 隐藏遮罩
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
        };
        this.setState({ data: pacsResponseData.result, ctrlState: newCtrlState });
      } else {
        this.setState({
          data: {},
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            requestErr: true,
            requestErrMsg: { msg: pacsResponseData.msg },
          },
        });
        this.handleRequestException({ status: 600, msg: pacsResponseData.msg });
      }
      // console.log('responseData===', responseData);
    } catch (e) {
      // 隐藏遮罩
      this.setState({
        data: {},
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
  render() {
    const data = this.state.data;
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return PacsDetail.renderPlaceholderView();
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} >
          <View style={styles.normalView}>
            <Text style={styles.title}>检查项目 {data.name }</Text>
            <Text style={styles.normalText}>检查类型 {data.type}</Text>
            <Text style={styles.normalText}>检查日期 {data.checkTime}</Text>
            <Text style={styles.normalText}>检查部位 {data.part}</Text>
          </View>
          <Sep height={10} bgColor={Global.colors.IOS_GRAY_BG} />
          <View style={styles.normalView}>
            <Text style={styles.title}>检查所见</Text>
            <Text style={styles.normalText}>{data.see}</Text>
          </View>
          <Sep height={10} bgColor={Global.colors.IOS_GRAY_BG} />
          <View style={styles.normalView}>
            <Text style={styles.title}>诊断结果</Text>
            <Text style={styles.normalText}>{data.result}</Text>
          </View>
        </ScrollView>
        <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
      </View>
    );
  }
}
//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Global.getScreen().height,
    backgroundColor: Global.colors.IOS_GRAY_BG,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    width: Global.getScreen().width,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 15,
    color: '#080808',
  },
  normalView: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  normalText: {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    color: '#999999',
    width: Global.getScreen().width,
    flex: 1,
    backgroundColor: 'white',

  },
  reference: { marginLeft: 10 },
  result: { paddingLeft: 10 },
  state: { paddingLeft: 25 },
});

PacsDetail.navigationOptions = {
  title: '特检单详情',
};

export default PacsDetail;
