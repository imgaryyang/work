/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  InteractionManager,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Sep from 'rn-easy-separator';
import moment from 'moment';
import Card from 'rn-easy-card';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';

import Global from '../../Global';
import TestItem from './TestItem';
import Item from '../../modules/PureListItem';

import { diagnoseList, recordList } from '../../services/records/RecordService';
import { hisTestList, hisPacsList } from '../../services/reports/TestService';

class RecordDetails extends Component {
  static displayName = 'RecordDetails';
  static description = '诊疗详情';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]}>
        <ScrollView style={styles.scrollView}>
          <Card fullWidth >
            <Text style={styles.titleText}>诊断详情</Text>
            <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
            <ActivityIndicator style={{ margin: 40 }} />
          </Card>
          <View style={{ flexDirection: 'row-reverse', height: 10 }} />
          <Card fullWidth >
            <Text style={styles.titleText}>药物医嘱</Text>
            <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
            <ActivityIndicator style={{ margin: 40 }} />
          </Card>
          <View style={{ flexDirection: 'row-reverse', height: 10 }} />
          <Card fullWidth >
            <Text style={styles.titleText}>化验医嘱</Text>
            <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
            <ActivityIndicator style={{ margin: 40 }} />
          </Card>
        </ScrollView>
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.renderDrugItem = this.renderDrugItem.bind(this);
    this.renderTestItem = this.renderTestItem.bind(this);
    this.showDetail = this.showDetail.bind(this);
    // this.fetchTestData = this.fetchTestData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.conventTestData = this.conventTestData.bind(this);
  }

  state = {
    doRenderScene: false,
    diagnoseData: null,
    recordDrugData: null,
    recordTestData: null,
    pacsData: null,
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
      }, () => this.fetchData());
    });
    this.props.navigation.setParams({
      title: '诊疗详情',
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <Button
            onPress={this.fetchData}
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

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }


  showDetail(item, index) {
    // console.log("item====",item);
    if (item.testType === '0001') {
      this.props.navigation.navigate('LisDetail', {
        barcode: item.barcode,
        data: item.testDetail,
        checkId: item.id,
        checkName: item.itemName,
        index,
      });
    } else if (item.testType === '0002') {
      // this.props.navigation.navigate('PacsDetail', {
      //   barcode: item.barcode,
      //   data: item,
      //   checkId: item.id,
      //   checkName: item.itemName,
      //   index,
      // });
      this.props.navigation.navigate('PacsWebView', {
        barcode: item.barcode,
        data: item,
        checkId: item.id,
        checkName: item.itemName,
        index,
      });
    }
  }
  //
  conventTestData(lisResult, pacsResult) {
    // console.log('lisResult======', lisResult);
    // console.log('pacsResult======', pacsResult);
    // const { lisData, pacsData } = this.state;
    // 处理lis数据
    for (let i = 0; i < lisResult.length; i++) {
      lisResult[i].testType = '0001';
      lisResult[i].pkgName = '化验';
    }
    // 处理pacs数据
    for (let i = 0; i < pacsResult.length; i++) {
      pacsResult[i].testType = '0002';
      pacsResult[i].pkgName = '特检';
      // pacsResult[i].reportTime = pacsResult[i].orderTime;
      // pacsResult[i].itemName = pacsResult[i].name;
    }
    const recordTestData = lisResult.concat(pacsResult);
    return recordTestData;
  }
  // // 搜索
  // onSearch() {
  //   // 重新发起按条件查询
  //   this.setState({
  //     ctrlState: {
  //       refreshing: true,
  //     },
  //   }, () => this.fetchData());
  // }


  async fetchData() {
    // console.log('fetchData====');

    let diagResult = [];
    let recordResult = [];
    let lisResult = [];
    let pacstResult = [];
    let testResult = [];
    let Msg = '';
    let diagData = null;
    let recordData = null;
    let lisData = null;
    let pacsData = null;

    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        requestErr: false,
        requestErrMsg: null,
      },
    });
    // diagData
    try {
      diagData = await diagnoseList(this.state.value);
      if (diagData.success) {
        diagResult = diagData.result ? diagData.result : [];
      } else {
        Msg = diagData.msg;
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          // refreshing: false,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }

    // recordData
    try {
      recordData = await recordList(this.state.value);
      if (recordData.success) {
        recordResult = recordData.result ? recordData.result : null;
      } else {
        Msg = Msg.concat(recordData.msg);
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          // refreshing: false,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      // console.log('e====', e);
      this.handleRequestException(e);
    }
    // test
    try {
      lisData = await hisTestList(this.state.value);
      pacsData = await hisPacsList(this.state.value);
      console.log('lisData', lisData);
      console.log('pacsData', pacsData);
      // lis
      if (lisData.success) {
        lisResult = lisData.result ? lisData.result : [];
        for (let i = 0; i < lisResult.length; i++) {
          lisResult[i].testType = '0001';
          lisResult[i].pkgName = '化验';
        }
        testResult = testResult.concat(lisResult);
      } else {
        Msg = Msg.concat(lisData.msg);
        this.handleRequestException({ status: 600, msg: lisData.msg });
      }
      // pacs
      if (pacsData.success) {
        pacstResult = pacsData.result ? pacsData.result : [];
        for (let i = 0; i < pacstResult.length; i++) {
          pacstResult[i].testType = '0002';
          pacstResult[i].pkgName = '特检';
          // pacsResult[i].reportTime = pacsResult[i].orderTime;
          // pacsResult[i].itemName = pacsResult[i].name;
        }
        // Msg.concat
        testResult = testResult.concat(pacstResult);
        console.log('testResult', testResult);
      } else {
        Msg = Msg.concat(pacsData.msg);
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          // refreshing: false,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
    this.setState({
      diagnoseData: diagResult,
      recordDrugData: recordResult,
      recordTestData: testResult,
      ctrlState: {
        refreshing: false,
      },
    });
    // 不处理接口调用问题
    if ((diagData !== null) && (recordData !== null) && (lisData !== null) && (pacsData !== null)) {
      // 只处理接口返回的数据问题
      if (!diagData.success || !recordData.success || !lisData.success || !pacsData.success) {
      // console.log('false====');
        this.setState({
          diagnoseData: diagResult,
          recordDrugData: recordResult,
          recordTestData: testResult,
          requestErr: true,
          requestErrMsg: { status: 600, msg: Msg },
          ctrlState: {
            refreshing: false,
          },
        });
        this.handleRequestException({ status: 600, msg: Msg });
      } else {
      // 接口调用错误已经在上面的try catch中处理，此处包括接口全部正常数据及接口调用出现问题的数据
      // console.log('success====');
        this.setState({
          diagnoseData: diagResult,
          recordDrugData: recordResult,
          recordTestData: testResult,
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
      }
    } else {
      this.setState({
        diagnoseData: diagResult,
        recordDrugData: recordResult,
        recordTestData: testResult,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      });
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

  renderDrugItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
        contentStyle={{ padding: 0 }}
      >
        <View style={{ flex: 1, margin: 15, marginLeft: 0 }} >
          <View style={[styles.itemRowContainer, styles.mainItemRowContainer]} >
            <Text style={{ flex: 1 }} >{item.name}{item.form ? ` ( ${item.form} )` : null}</Text>
            <Text style={styles.itemBarcode} >{item.barcode}</Text>
          </View>
          <View style={styles.itemRowContainer} >
            <Text style={{ flex: 1 }} ><Text style={styles.normalLabel} >用量：</Text><Text style={styles.normalValue} >{item.dose}</Text></Text>
            <Text style={{ flex: 1 }} ><Text style={styles.normalLabel} >频率：</Text><Text style={styles.normalValue} >{item.frequency}</Text></Text>
            <Text style={{ flex: 1 }} ><Text style={styles.normalLabel} >用法：</Text><Text style={styles.normalValue} >{item.way}</Text></Text>
          </View>
          {
            item.specialWay ? (
              <View style={styles.itemRowContainer} >
                <Text style={styles.normalLabel} >备注：</Text>
                <Text style={styles.normalValue} >{item.specialWay}</Text>
              </View>
            ) : null
          }
        </View>
      </Item>
    );
  }

  /**
   * 渲染检查项目行数据
   */
  renderTestItem({ item, index }) {
    console.log('item....', item);
    const color = item.pkgName === '特检' ? 'red' : '#F68B24';
    return (
      <Item
        data={item}
        index={index}
        onPress={this.showDetail}
        chevron
      >
        <View style={styles.renderRow} >
          <View style={[styles.logo, { borderColor: `${color}` }]}>
            <Text style={[styles.logoName, { color: `${color}` }]}>{ item.pkgName } </Text>
          </View>
          <View>
            <Text style={styles.checkDate}>{ item.reportTime } </Text>
            <Text style={styles.itemName}>{ item.itemName } </Text>
          </View>
        </View>
      </Item>
    );
  }
  render() {
    if (!this.state.doRenderScene) { return RecordDetails.renderPlaceholderView(); }
    // const recipe = this.state.recordDrugData && this.state.recordDrugData.length > 0 ? (
    //   <RecipeItem
    //     data={this.state.recordDrugData}
    //     refreshing={this.state.ctrlState.refreshing}
    //     onRefresh={this.fetchData}
    //     reloadCallback={this.fetchData}
    //   />
    // ) : (
    //   <Text style={styles.text}>暂无信息</Text>
    // );
    //
    console.log('this.state.recordTestData', this.state.recordTestData);
    const testItem = this.state.recordTestData && this.state.recordTestData.length > 0 ? (
      <TestItem
        data={this.state.recordTestData}
        refreshing={this.state.ctrlState.refreshing}
        onRefresh={this.fetchData}
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
              onRefresh={this.fetchData}
              ListEmptyComponent={() => {
                return this.renderEmptyView({
                  msg: '暂无诊断信息',
                  reloadMsg: '点击刷新按钮重新加载',
                  reloadCallback: this.fetchData,
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
              <FlatList
                data={this.state.recordDrugData}
                ref={(c) => { this.listRef = c; }}
                keyExtractor={(item, index) => `${item}${index + 1}`}
                ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
                renderItem={this.renderDrugItem}
                refreshing={this.state.ctrlState.refreshing}
                onRefresh={this.fetchData}
                ListEmptyComponent={() => {
                  return this.renderEmptyView({
                    msg: '暂无药品信息',
                    reloadMsg: '点击刷新按钮重新加载',
                    reloadCallback: this.fetchData,
                    ctrlState: this.state.ctrlState,
                  });
                }}
              />
            </View>
          </Card>
          <View style={{ flexDirection: 'row-reverse', height: 10 }} />
          <Card fullWidth >
            <View style={{ backgroundColor: 'white' }}>
              <Text style={styles.titleText}>化验医嘱</Text>
              <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
              <FlatList
                data={this.state.recordTestData}
                ref={(c) => { this.listRef = c; }}
                keyExtractor={(item, index) => `${item}${index + 1}`}
                ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
                renderItem={this.renderTestItem}
                refreshing={this.state.ctrlState.refreshing}
                onRefresh={this.fetchData}
                ListEmptyComponent={() => {
                  return this.renderEmptyView({
                    msg: '暂无检验信息',
                    reloadMsg: '点击刷新按钮重新加载',
                    reloadCallback: this.fetchData,
                    ctrlState: this.state.ctrlState,
                  });
                }}
              />
            </View>
          </Card>
          <View style={{ height: 40 }} />
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

  title: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Global.getScreen().width,
    height: 40,

    backgroundColor: 'white',
    flexWrap: 'wrap',
  },
  renderRow: {
    width: Global.getScreen().width,
    height: 64,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 44,
    height: 44,
    marginLeft: 20,
    borderRadius: 22,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  logoName: {
    fontSize: 15,
  },
  checkDate: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 15,
  },
  itemName: {
    marginTop: 4,
    fontSize: 15,
    marginLeft: 15,
    color: 'black',
  },

  list: {
    flex: 1,
  },
  itemRowContainer: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
  },
  mainItemRowContainer: {
    paddingBottom: 5,
  },
  itemBarcode: {
    width: 100,
    textAlign: 'right',
  },
  normalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  normalValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Global.colors.FONT_GRAY,
  },
  planedExecTime: {
    color: Global.colors.IOS_RED,
  },
});

export default RecordDetails;
