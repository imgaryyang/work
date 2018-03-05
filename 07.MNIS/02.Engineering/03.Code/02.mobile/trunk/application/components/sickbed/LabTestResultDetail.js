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
import { testOrderResult } from '../../services/sickbed/Sickbed';
// import { loadCheckDetail } from '../../services/patients/MedicalCheckService';
// import { loadHisCheckDetail } from '../../services/patients/MedicalCheckService';


class Item extends PureComponent {
  render() {
    const detail = this.props.data;
    const color = detail.flag === '0' ? 'black' : detail.flag === '1' ? 'red' : '#6CD809';
    return (

      <View style={styles.renderRow} >
        <View style={styles.rowName}>
          <Text style={[styles.name, { color: `${color}` }]}>{detail.name || ''}</Text>
          {detail.reference !== null ? (<Text style={styles.reference}>参考值：{detail.range || ''}</Text>) : null}
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.result, { color: `${color}` }]}>{detail.result || ''}</Text>
        </View>
        <View style={{ flex: 2 }}>
          {detail.flag === '0' ? null : detail.flag === '1' ? (<Icon name="ios-arrow-round-up" size={40} color="red" />) :
                (<Icon name="ios-arrow-round-down" size={40} color="#6CD809" />)}
        </View>
      </View>
    );
  }
}

class LabTestResultDetail extends Component {
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
  }

  async loadCheckDetail() {
    try {
      // 显示遮罩
      this.props.screenProps.showLoading();
      const query = { orderNo: this.props.navigation.state.params.orderNO };
      // const responseData = await loadHisCheckDetail(query);
      const responseData = await testOrderResult(query.orderNo);
      console.log('testOrderResult', responseData);
      if (responseData.success === true) {
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        this.setState({ data: responseData.result });
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
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return LabTestResultDetail.renderPlaceholderView();
    }
    return (
      <View style={{ width: Global.getScreen().width, overflow: 'hidden' }} >

        <View style={styles.title}>
          <Text style={styles.itemName}>{name || '血常规'}</Text>
          <Text style={styles.introduce}>项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍</Text>
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
          ItemSeparatorComponent={() => (<Sep height={2 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
          ListEmptyComponent={() => {
              return (<View style={{ backgroundColor: 'white', height: 500 }} ><Text>暂无报告单信息</Text></View>);
          }}
          style={styles.list}
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

LabTestResultDetail.navigationOptions = {
  title: '化验单详情',
};

export default LabTestResultDetail;
