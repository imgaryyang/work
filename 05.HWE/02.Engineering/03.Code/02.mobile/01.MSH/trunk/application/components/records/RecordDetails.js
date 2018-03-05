import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  InteractionManager,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import moment from 'moment';
import Card from 'rn-easy-card';

import Global from '../../Global';
import RecipeItem from './RecipeItem';
import TestItem from './TestItem';
import Item from '../../modules/PureListItem';

import { diagnoseList, recordList, recordTestList } from '../../services/records/RecordService';

class RecordDetails extends Component {
  static displayName = 'RecordDetails';
  static description = '诊疗详情';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
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
    diagnoseData: null,
    recordDrugData: null,
    recordTestData: null,
    ctrlState: {
      refreshing: false,
    },
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          refreshing: true,
        },
      }, () => this.fetchData());
    });
    this.props.navigation.setParams({
      title: '诊疗详情',
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }
  // 搜索
  onSearch() {
    // 重新发起按条件查询
    this.setState({
      ctrlState: {
        refreshing: true,
      },
    }, () => this.fetchData());
  }
  async fetchData() {
    try {
      const responseData = await diagnoseList(this.state.value);
      const recordData = await recordList(this.state.value);
      const recordTestData = await recordTestList(this.state.value);
      if (responseData.success) {
        this.setState({
          diagnoseData: responseData.result ? responseData.result : null,
          recordDrugData: recordData.result ? recordData.result : null,
          recordTestData: recordTestData.result ? recordTestData.result : null,
          ctrlState: {
            refreshing: false,
          },
        });
      } else {
        this.setState({
          ctrlState: {
            refreshing: false,
          },
        });
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          refreshing: false,
        },
      });
      this.handleRequestException(e);
    }
  }
  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
        contentStyle={{ padding: 0 }}
      >
        <View style={Global.styles.CONTAINER}>
          <View style={{ flex: 1, margin: 15, marginLeft: 0 }} >
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>诊</Text>
              <Sep width={30} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>断</Text>
              <Sep width={10} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.diseaseName}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>时</Text>
              <Sep width={30} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>间</Text>
              <Sep width={10} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{moment(item.diseaseTime).format('YYYY-MM-DD HH:MM')}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>医</Text>
              <Sep width={30} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>生</Text>
              <Sep width={10} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.docName}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>病</Text>
              <Sep width={30} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>史</Text>
              <Sep width={10} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.diseaseType ? '无' : '无'}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>科</Text>
              <Sep width={30} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>室</Text>
              <Sep width={10} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.depName}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1 }}>主要诊断</Text>
              <Sep width={10} />
              <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{item.isCurrent === '1' ? '是' : '否'}</Text>
            </View>
          </View>
        </View>
      </Item>
    );
  }
  render() {
    if (!this.state.doRenderScene) { return RecordDetails.renderPlaceholderView(); }
    const recipe = this.state.recordDrugData && this.state.recordDrugData.length > 0 ? (
      <RecipeItem
        data={this.state.recordDrugData}
        refreshing={this.state.ctrlState.refreshing}
        onRefresh={this.onSearch}
      />
    ) : (
      <Text style={styles.text}>暂无信息</Text>
    );
    const testItem = this.state.recordTestData && this.state.recordTestData.length > 0 ? (
      <TestItem
        data={this.state.recordTestData}
        refreshing={this.state.ctrlState.refreshing}
        onRefresh={this.onSearch}
      />
    ) : (
      <Text style={styles.text}>暂无信息</Text>
    );
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView style={styles.scrollView}>
          <Card fullWidth >
            <Text style={styles.titleText}>诊断详情</Text>
            <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
            <FlatList
              data={this.state.diagnoseData}
              ref={(c) => { this.listRef = c; }}
              keyExtractor={(item, index) => `${item}${index + 1}`}
              ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
              renderItem={this.renderItem}
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
            />
          </Card>
          <View style={{ flexDirection: 'row-reverse', height: 10 }} />
          <Card fullWidth >
            <View style={{ backgroundColor: 'white' }} >
              <Text style={styles.titleText}>药物医嘱</Text>
              <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
              {recipe}
            </View>
          </Card>
          <View style={{ flexDirection: 'row-reverse', height: 10 }} />
          <Card fullWidth >
            <View style={{ backgroundColor: 'white' }}>
              <Text style={styles.titleText}>化验医嘱</Text>
              <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
              {testItem}
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    color: Global.colors.FONT,
    paddingBottom: 12,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    color: Global.colors.FONT_LIGHT_GRAY1,
    marginTop: 10,
  },
});

export default RecordDetails;
