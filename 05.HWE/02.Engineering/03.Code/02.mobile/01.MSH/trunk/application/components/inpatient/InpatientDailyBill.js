/**
 * 住院日清单
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import Icon from 'rn-easy-icon';
import { SafeAreaView } from 'react-navigation';

import Global from '../../Global';
import ctrlState from '../../modules/ListState';
import Item from '../../modules/PureListItem';
import DatePicker from '../../modules/EasyDatePicker';
import { filterMoney } from '../../utils/Filters';
import { loadHisInpatientDailylist } from '../../services/inpatient/InpatientService';

class InpatientDailyBill extends Component {
  static displayName = 'InpatientDailyBill';
  static description = '住院日清单';

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
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    ctrlState,
    profile: {},
    selectDate: new Date(),
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
      title: '住院日清单',
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
      // 获得当前的医院Id
      const hosNo = this.props.base.currHospital.no;
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      const profileNo = this.state.profile.no;
      const startDate = moment(this.state.selectDate).format('YYYY-MM-DD');
      const endDate = moment(this.state.selectDate).format('YYYY-MM-DD');
      /* const query = { proNo: '900000000021', hosNo, startDate, endDate };*/
      const query = { proNo: profileNo, hosNo, startDate, endDate };
      // console.log('query=', query);
      const responseData = await loadHisInpatientDailylist(query);
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
    const firstMargin = index === 0 ? {
      // marginTop: 10,
    } : {};
    return (
      <Item
        data={item}
        index={index}
        chevron={false}
        style={firstMargin}
      >
        <View style={{ flex: 1 }} >
          <View style={{ flexDirection: 'row' }}>
            {/* <Text style={styles.titleText_1}>项目:</Text>
            <Sep width={4} />*/}
            <Text style={styles.text_1}>{item.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 8 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.titleText_2}>单价:</Text>
              <Sep width={2} />
              <Text style={styles.text}>{filterMoney(item.price, 2)}&nbsp;元</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.titleText_2}>数量:</Text>
              <Sep width={2} />
              <Text style={styles.text}>{item.num}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Text style={styles.text_red}>小计:</Text>
              <Sep width={2} />
              <Text style={styles.text_red}>{filterMoney(item.realAmount, 2)}&nbsp;元</Text>
            </View>
          </View>
        </View>
      </Item>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return InpatientDailyBill.renderPlaceholderView();
    }
    // console.log('this.state.selectDate:', this.state.selectDate);
    const { data } = this.state;
    const tmpData = data;
    let totalAmount = 0;
    let tmpTotalAmount = 0;
    if (tmpData && tmpData.length > 0) {
      // let i = 0;
      for (const d of tmpData) {
        tmpTotalAmount += parseFloat(d.realAmount);
        // i += 1;
      }
      totalAmount = tmpTotalAmount;
    }
    return (
      <SafeAreaView style={[Global.styles.CONTAINER, { backgroundColor: 'white' }]} >
        <View style={styles.btnContainer} >
          {/* <TouchableOpacity
            style={styles.preBtn}
            onPress={() => {
              if (this.state.refreshing) return;
              this.setState(
                { selectDate: new Date(moment(this.state.selectDate).subtract(1, 'd').format('YYYY-MM-DD hh:mm:ss')) },
                () => this.fetchData(),
              );
            }}
          >
            <Text style={styles.btnText} >前一天</Text>
          </TouchableOpacity>*/}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => {
              this.easyDatePicker.pickDate({
                date: this.state.selectDate,
                maxDate: new Date(),
              }, (date) => {
                this.setState({ selectDate: date }, () => this.fetchData());
              });
            }}
          >
            {/* <Text style={[styles.date, { fontSize: 15, color: Global.colors.FONT_GRAY }]} >选择日期：</Text>*/}
            <Text style={styles.date} >{moment(this.state.selectDate).format('YYYY-MM-DD')}</Text>
            <Icon name="ios-arrow-down" size={12} width={12} height={12} color={Global.colors.FONT_LIGHT_GRAY1} style={styles.switchIcon} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => {
              if (this.state.refreshing) return;
              this.setState(
                { selectDate: new Date(moment(this.state.selectDate).add(1, 'd').format('YYYY-MM-DD hh:mm:ss')) },
                () => this.fetchData(),
              );
            }}
          >
            <Text style={styles.btnText} >后一天</Text>
          </TouchableOpacity>*/}
        </View>
        <DatePicker ref={(c) => { this.easyDatePicker = c; }} />
        {/* <Button
          text="选择日期"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => {
            this.easyDatePicker.pickDate({
              date: this.state.selectDate,
              maxDate: new Date(),
            }, (date) => {
              this.setState({ selectDate: date }, () => this.fetchData());
            });
          }}
        />*/}
        <FlatList
          data={this.state.data}
          ref={(c) => { this.listRef = c; }}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={this.renderItem}
          ItemSeparatorComponent={() => (<Sep height={15} style={{ backgroundColor: Global.colors.IOS_GRAY_BG }} />)}
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
          /* ListFooterComponent={() => {
            return this.renderFooter({
              data: this.state.data,
              ctrlState: this.state.ctrlState,
              callback: this.onInfiniteLoad,
            });
          }}*/
          ListFooterComponent={() => (<View style={{ height: 15 }} />)}
          style={styles.flatList}
        />
        <View style={styles.bottomBar} >
          <Text style={styles.totalAmt}>总计：{filterMoney(totalAmount, 2)}&nbsp;元</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: Global.colors.IOS_GRAY_BG,
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
  preBtn: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    paddingLeft: 15,
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 30,
    paddingRight: 15,
  },
  btnText: {
    fontSize: 13,
    color: Global.colors.IOS_BLUE,
  },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    // paddingLeft: 15,
  },
  date: {
    fontSize: 17,
    lineHeight: 17,
    textAlign: 'center',
    color: '#000000',
    fontWeight: '600',
  },
  switchIcon: {
    marginLeft: 6,
  },
  text: {
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
  },
  text_1: {
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
  },
  text_red: {
    fontSize: 13,
    color: '#000000',
    textAlign: 'right',
  },
  titleText_1: {
    fontSize: 15,
    color: Global.colors.FONT_LIGHT_GRAY1,
  },
  titleText_2: {
    fontSize: 13,
    color: Global.colors.FONT_LIGHT_GRAY1,
  },
  totalAmt: {
    fontSize: 15,
    fontWeight: '600',
    color: Global.colors.IOS_BLUE,
  },
  button: {
    flex: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
  },
  bottomBar: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 15,
    backgroundColor: 'white',
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.NAV_BAR_LINE,
  },
});

const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps, null)(InpatientDailyBill);
