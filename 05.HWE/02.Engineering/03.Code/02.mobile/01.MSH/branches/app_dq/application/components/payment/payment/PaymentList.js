import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  SectionList,
  InteractionManager,
} from 'react-native';

import _ from 'lodash';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import ctrlState from '../../../modules/ListState';
import Global from '../../../Global';
import Checkbox from '../../../modules/Checkbox';
import Item from '../../../modules/PureListItem';
import ChangePatient from '../../me/patients/ChangePatient';

const data = [
  {
    code: '001', name: '红霉素', amount: '10', desc: '', unit: '1', price: '10', num: '1', department: '消化内科', group: '0', doctor: '何润东', time: '2018年02月02日',
  },
  {
    code: '002', name: '氯霉素', amount: '100', desc: '', unit: '1', price: '100', num: '1', department: '消化内科', group: '0', doctor: '何润东', time: '2018年02月02日',
  },
  {
    code: '003', name: '阿莫西林胶囊', amount: '100', desc: '', unit: '1', price: '50', num: '2', department: '保养科', group: '1', doctor: '黄晓明', time: '2018年02月02日',
  },
  {
    code: '004', name: '头孢氨苄胶囊', amount: '200', desc: '', unit: '1', price: '100', num: '2', department: '保养科', group: '1', doctor: '黄晓明', time: '2018年02月02日',
  },
  {
    code: '005', name: '六味地黄丸', amount: '100', desc: '', unit: '1', price: '50', num: '2', department: '呼吸内科', group: '2', doctor: '韦小宝', time: '2018年02月02日',
  },
  {
    code: '006', name: '壮阳补肾胶囊', amount: '200', desc: '', unit: '1', price: '100', num: '2', department: '呼吸内科', group: '2', doctor: '韦小宝', time: '2018年02月02日',
  },
];

class PaymentList extends Component {
  static displayName = 'PaymentList';
  static description = '缴费项目';
  static getSections(list) {
    const sections = [];
    let flag = 0;
    const datas = [];
    for (let i = 0; i < list.length; i++) {
      let az = '';
      for (let j = 0; j < datas.length; j++) {
        if (datas[j][0].group === list[i].group) {
          flag = 1;
          az = j;
          break;
        }
      }
      if (flag === 1) {
        datas[az].push(list[i]);
        flag = 0;
      } else if (flag === 0) {
        const wdy = [];
        wdy.push(list[i]);
        datas.push(wdy);
        sections.push({ key: '处方'+ list[i].group, data: wdy, department: list[i].department, doctor: list[i].doctor });
      }
    }
    return sections;
  }

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.callback = this.callback.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.sectionComp = this.sectionComp.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  state = {
    doRenderScene: false,
    data,
    ctrlState,
    selectedIds: [],
    paymentList: [],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      });
    });
  }

  onSearch() {
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
    });
  }
  // 选择行项目
  onSelect(info) {
    const { key } = info.section;
    this.setState((state) => {
      const ids = state.selectedIds.concat();
      const idx = _.indexOf(ids, key);
      if (idx === -1) {
        ids[ids.length] = key;
      } else {
        ids.splice(idx, 1);
      }
      return { selectedIds: ids };
    });
  }

  callback(patient, profile) {
    console.log('item>>>>>>>>>>>>>111111', patient);
    console.log('item>>>>>>>>>>>>>222222', profile);
  }
  sectionComp = (info) => {
    const { key } = info.section;
    return (
      <View style={styles.header}>
        <Text style={styles.headerText} >
          {key}
        </Text>
        <Checkbox
          style={{ flex: 1, marginTop: 5 }}
          checked={_.indexOf(this.state.selectedIds, key) !== -1}
          onPress={() => this.onSelect(info)}
        />
      </View>
    );
  }
  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        chevron={null}
        index={index}
      >
        <View style={{ flex: 1, flexDirection: 'row' }} >
          <View style={{ flex: 3, flexDirection: 'column' }} >
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.inforMain}>{item.name}</Text>
            </View>
            <Sep height={5} />
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>数量</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.num}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>单价</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.price}元</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }} >
              <Text style={styles.info}>金额</Text>
              <Sep width={10} />
              <Text style={styles.info}>{item.amount}元</Text>
            </View>
          </View>
        </View>
      </Item>
    );
  }

  render() {
    if (!this.state.doRenderScene) { return PaymentList.renderPlaceholderView(); }
    const value = PaymentList.getSections(data);
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView style={styles.scrollView}>
          <View
            automaticallyAdjustContentInsets={false}
            style={styles.scrollView}
          >
            <ChangePatient callback={this.callback} />
            <SectionList
              renderSectionHeader={this.sectionComp}
              renderItem={this.renderItem}
              sections={value}
              keyExtractor={(item, index) => (1 + index + item)}
              ItemSeparatorComponent={() => <View style={{ height: Global.lineWidth, backgroundColor: Global.colors.LINE, marginLeft: 10, marginRight: 10 }} />}
              // 控制下拉刷新
              refreshing={this.state.ctrlState.refreshing}
              onRefresh={this.onSearch}
              // 无数据占位符
              ListEmptyComponent={() => {
                return this.renderEmptyView({
                  msg: '暂无卡号信息',
                  reloadMsg: '点击刷新按钮重新查询',
                  reloadCallback: this.onSearch,
                  ctrlState: this.state.ctrlState,
                });
              }}
            />
          </View>
          <View style={{ margin: 10, marginBottom: 40 }}>
            <Button text="医保缴费" onPress={() => { this.props.navigation.navigate('PreSettlement'); }} theme={Button.THEME.ORANGE} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {},
  header: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    // borderTopWidth: Global.lineWidth,
    // borderTopColor: Global.colors.LINE,
    borderBottomWidth: Global.lineWidth,
    borderBottomColor: Global.colors.LINE,
    backgroundColor: 'white',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerText: {
    flex: 6,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 40,
    color: Global.colors.FONT_GRAY,
    paddingLeft: 15,
  },
  inforMain: {
    color: '#2C3742',
    fontSize: 15,
  },
  infor: {
    color: '#999999',
    fontSize: 14,
  },
});

PaymentList.navigationOptions = {
  headerTitle: '缴费项目',
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentList);
