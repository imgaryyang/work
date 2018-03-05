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
import Icon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import Global from '../../Global';
import ctrlState from '../../modules/ListState';
import { loadHisCheckDetail } from '../../services/reports/MedicalCheckService';


class Item extends PureComponent {
  render() {
    const detail = this.props.data;
    const color = detail.flag === '0' ? 'black' : detail.flag === '1' ? 'red' : '#6CD809';
    return (

      <View style={styles.renderRow} >
        <View style={styles.rowName}>
          <Text style={styles.name}>{detail.subject || ''}</Text>
          {detail.reference !== null ? (<Text style={styles.reference}>参考值：{detail.reference || ''}</Text>) : null}
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

class ShowDetailItems extends Component {
  static displayName = 'Reports';
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
    data: [],
    ctrlState,
  };
  componentWillMount() {
    this.loadCheckDetail();
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
      // 显示遮罩
      // this.props.screenProps.showLoading();
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
      // const responseData = await loadCheckDetail(checkid);
      const responseData = await loadHisCheckDetail(query);
      if (responseData.success === true) {
        // 隐藏遮罩
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
        };
        this.setState({ data: responseData.result, ctrlState: newCtrlState });
      } else {
        Alert.alert(
          '提示',
          responseData.msg,
          [
            {
              text: '确定',
              onPress: () => {
                // this.setState({ value: {} });
              },
            },
          ],
        );
      }
    } catch (e) {
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
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
    const name = this.props.navigation.state.params.checkName;
    let desc = '';
    const niao = '尿常规通过对人体尿液表象及成分的分析，检测是否可能患有某些泌尿系统疾病或糖尿病。尿常规检查内容包括尿的颜色、透明度、白细胞、上皮细胞、管型、蛋白质、比重及尿糖定性的检查。';
    const gan = '肝功能检查是通过各种生化试验方法检测与肝脏功能代谢有关的各项指标、以反映肝脏功能基本状况的检查。';
    const xue = '血常规是最一般，最基本的血液检验。血液由液体和有形细胞两大部分组成，血常规检验的是血液的细胞部分。血液有三种不同功能的细胞——红细胞(俗称红血球)，白细胞(俗称白血球)、血小板。';
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return ShowDetailItems.renderPlaceholderView();
    }
    if (name === '血常规') {
      desc = xue;
    }
    if (name === '尿常规') {
      desc = niao;
    }
    if (name === '肝功能检查') {
      desc = gan;
    }
    return (
      <View style={{ width: Global.getScreen().width, backgroundColor: Global.colors.IOS_GRAY_BG, overflow: 'hidden' }} >

        <View style={styles.title}>
          <Text style={styles.itemName}>{name || '血常规'}</Text>
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
  scrollView: {
    flex: 1,
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
    height: 40,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderColor: 'blue',
    // borderWidth: 1,
  },
  titleText: {

    fontSize: 12,
    color: '#999999',
    // borderColor: 'blue',
    // borderWidth: 1,
  },

  itemName: {
    paddingTop: 15,
    paddingLeft: 10,
    fontSize: 15,
    color: 'black',
    width: Global.getScreen().width,
    // width: 200,
    // borderColor: 'blue',
    // borderWidth: 1,

  },
  introduce: {
    paddingTop: 8,
    paddingLeft: 10,
    fontSize: 12,
    color: '#999999',
    width: Global.getScreen().width,
    // borderColor: 'blue',
    // borderWidth: 1,
  },
  renderRow: {
    flexDirection: 'row',
    marginTop: 1,
    width: Global.getScreen().width,
    height: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  name: {
    marginLeft: 10,
    // color: 'black',
    fontSize: 15,
    color: 'black',

    // borderColor: 'blue',
    // borderWidth: 1,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Global.getScreen().width,
    height: 40,
    // marginTop: 8,
    // borderColor: 'red',
    // borderWidth: 1,
    backgroundColor: 'white',
  },
  rowName: {
    // borderColor: 'blue',
    // borderWidth: 1,
    flex: 6,
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'flex-start',

  },
  reference: { marginLeft: 10 },
  result: { paddingLeft: 10 },
  state: { paddingLeft: 25 },
});

export default ShowDetailItems;
