/* eslint-disable indent,react/no-unused-state,no-trailing-spaces,no-param-reassign */
/**
 * 报告查询列表
 */

import React, { Component, PureComponent } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SectionList,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Sep from 'rn-easy-separator';
import Global from '../../Global';
import ctrlState from '../../modules/ListState';
import { hisTestList, hisPacsList } from '../../services/reports/TestService';

class Item extends PureComponent {
  onPress = () => {
    this.props.onPressItem(this.props.data, this.props.index);
  };
  render() {
    const check = this.props.data;
    const color = check.pkgName === '特检' ? 'red' : '#F68B24';
    return (
      <TouchableOpacity
        onPress={this.onPress}
      >
        <View style={styles.renderRow} >
          <View style={[styles.logo, { borderColor: `${color}` }]}>
            <Text style={[styles.logoName, { color: `${color}` }]}>{ check.pkgName } </Text>
          </View>
          <View>
            <Text style={styles.checkDate}>{ check.reportTime } </Text>
            <Text style={styles.itemName}>{ check.itemName } </Text>
          </View>
          <Sep height={10 / Global.pixelRatio} bgColor={Global.colors.LINE} />
        </View>
      </TouchableOpacity>
    );
  }
}


class Reports extends Component {
  static displayName = 'Reports';
  static description = '报告查询';

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
    this.showDetail = this.showDetail.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.loadCheckList = this.loadCheckList.bind(this);
    // this.afterChooseHospital = this.afterChooseHospital.bind(this);
    // this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.conventLisData = this.conventLisData.bind(this);
    this.conventPacsData = this.conventPacsData.bind(this);
    this.sub = this.sub.bind(this);
    // this.renderProfile = this.renderProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    lisData: [],
    pacsData: [],
    data: [],
    sections: [],
    profile: {},
    refreshing: false,
    ctrlState,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: '报告查询',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      // afterChooseHospital: this.afterChooseHospital,
      // afterChoosePatient: this.afterChoosePatient,
    });
    // const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => {
        this.getProfile(
          this.props.base.currHospital,
          this.props.base.currPatient,
          this.props.base.currProfile,
        );
      });
    });
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.getProfile(
        props.base.currHospital,
        props.base.currPatient,
        props.base.currProfile,
      );
    }
  }

  /**
   * 获取检查列表
   */
  getProfile(currHospital, currPatient, currProfile) {
    if (!currProfile || !currHospital || currProfile === undefined || currHospital === undefined) {
      currHospital = this.props.base.currHospital;
      currPatient = this.props.base.currPatient;
      currProfile = this.props.base.currProfile;
    }
    if (!currProfile) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: false,
          requestErrMsg: null,
        },
        data: {},
      });
      return;
    }
    // console.log('goto-------currProfile====', currProfile);
    this.setState({
      }, () => this.loadCheckList(currHospital, currPatient, currProfile));
  }

  /**
   * 单纯调用接口,不需要条件判断
   */
  async loadCheckList(currHospital, currPatient, currProfile) {
    let sections = [];
    let Msg = '';
    let newCtrlState = {};
    try {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
          requestErr: false,
          requestErrMsg: null,
        },
      });
      // lis 数据
      const query = { proNo: currProfile.no, hosNo: currHospital.no };
      const lisResponseData = await hisTestList(query);
      // console.log('lisResponseData==', lisResponseData);
      if (lisResponseData.success === true) {
        sections = await this.conventLisData([], lisResponseData.result);
        // console.log('lisResponseData==sections==', sections);
      } else {
        Msg = lisResponseData.msg;
      }

      // pacs 数据
      const query2 = { inpatientNo: currProfile.no };
      const pacsResponseData = await hisPacsList(query2);
      // console.log('pacsResponseData==', pacsResponseData);
      if (pacsResponseData.success === true) {
        sections = await this.conventPacsData(sections, pacsResponseData.result);
      } else {
        Msg = Msg.concat(pacsResponseData.msg);
      }

      if (lisResponseData.success === true && pacsResponseData.success === true) {
        newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
        };
      } else {
        newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: true,
          requestErrMsg: { status: 600, msg: Msg },
        };
        // console.log('after=======Msg==', Msg);
        this.handleRequestException({ status: 600, msg: Msg });
      }
      await this.setState({
        sections,
        ctrlState: newCtrlState,
      });
    } catch (e) {
      // 隐藏遮罩
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          sections: [],
          refreshing: false,
          noMoreData: true,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  /**
   * 设置医院
   */
  // async afterChooseHospital(hospital) {
    // await this.getProfile(hospital, this.props.base.currPatient);
    // await this.loadCheckList();
  // }

  /**
   * 设置病人
   */
  // afterChoosePatient(patient, profile) {
    // if (typeof profile !== 'undefined' && profile !== null) {
    //   this.setState({
    //     profile,
    //   }, () => this.getProfile());
    // }
  // }

  sub(value) {
    const index = value.indexOf(' ');
    return value.substring(0, index);
  }

  // 转换成以时间分组的sections
  conventLisData(sections, lisData) {
    // 处理lis数据
    for (let i = 0; i < lisData.length; i++) {
      let isFind = false;
      lisData[i].testType = '0001';
      const date = this.sub(lisData[i].reportTime);

      if (i === 0) {
        // 构建数据
        const info = {};
        info.key = date;
        const dataArry = [];
        dataArry.push(lisData[i]);
        info.data = dataArry;
        sections.push(info);
      } else {
        for (let j = 0; j < sections.length; j++) {
          if (sections[j].key === date) {
            isFind = true;
            sections[j].data.push(lisData[i]);
            break;
          }
        }
        // 如果之前没有相同的日期
        if (!isFind) {
          const info = {};
          info.key = date;
          const dataArry = [];
          dataArry.push(lisData[i]);
          info.data = dataArry;
          sections.push(info);
        }
      }
    }
    return sections;
  }

  conventPacsData(sections, pacsData) {
    // 处理pacs数据
    for (let i = 0; i < pacsData.length; i++) {
      let isFind = false;
      const date = this.sub(pacsData[i].orderTime);
      const info = {};
      info.key = date;
      const dataArry = [];
      pacsData[i].testType = '0002';
      pacsData[i].pkgName = '特检';
      pacsData[i].reportTime = pacsData[i].orderTime;
      pacsData[i].itemName = pacsData[i].name;
      dataArry.push(pacsData[i]);
      info.data = dataArry;

      for (let j = 0; j < sections.length; j++) {
        if (sections[j].key === date) {
          isFind = true;
          sections[j].data.push(pacsData[i]);
          break;
        }
      }
      // 如果之前没有相同的日期
      if (!isFind) {
        sections.push(info);
      }
    }
    return sections;
  }

  showDetail(item, index) {
    if (typeof index !== 'undefined') this.setState({ index });
    if (item.testType === '0001') {
      this.props.navigation.navigate('LisDetail', {
        title: '化验单详情',
        hideNavBarBottomLine: false,
        barcode: item.barcode,
        data: item,
        checkId: item.id,
        checkName: item.itemName,
        index,
      });
    } else if (item.testType === '0002') {
      // 文字版pacs详情
      this.props.navigation.navigate('PacsDetail', {
        title: '特检单详情',
        hideNavBarBottomLine: false,
        barcode: item.barcode,
        data: item,
        checkId: item.id,
        checkName: item.itemName,
        index,
      });
      // 文字版pacs详情
      // this.props.navigation.navigate('PacsWebView', {
      //   title: '特检单详情',
      //   hideNavBarBottomLine: false,
      //   barcode: item.barcode,
      //   data: item,
      //   checkId: item.id,
      //   checkName: item.itemName,
      //   index,
      // });
    }
  }

  /**
   * 列表展示
   */
  renderItem({ item, index }) {
    // console.log('render===item==', item);
    return (
      <Item
        data={item}
        index={index}
        onPressItem={this.showDetail}
      />
    );
  }

  /**
   * 分组的标题
   */
  renderTitle = (info) => {
    const checkDate = info.section.key;
    const weekday = `周${'日一二三四五六'.charAt(moment(checkDate, 'YYYY-MM-DD').day())}`;
    const size = info.section.data.length;
    return (
      <View style={styles.title} >
        <Text style={styles.titleText}>{checkDate} </Text>
        <Text style={styles.titleText}>{weekday} {size}个报告 </Text>
        <Sep height={Global.lineWidth} bgColor={Global.colors.LINE} />
      </View>
    );
  }

  render() {
    // console.log('render===this.state.sections==', this.state.sections);
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return Reports.renderPlaceholderView();
    }
    return (
      <View style={Global.styles.CONTAINER_BG} >
        <SectionList
          renderSectionHeader={this.renderTitle}
          ItemSeparatorComponent={() => (<Sep height={Global.lineWidth} bgColor={Global.colors.LINE} />)}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={this.renderItem}
          sections={this.state.sections}
          // 控制下拉刷新
          refreshing={this.state.ctrlState.refreshing}
          onRefresh={this.getProfile}
          // 无数据占位符
          ListEmptyComponent={() => {
            return this.renderEmptyView({
              msg: '暂无符合查询条件的报告单信息',
              reloadMsg: '点击刷新按钮重新查询',
              reloadCallback: this.getProfile,
              ctrlState: this.state.ctrlState,
            });
          }}
          ListFooterComponent={() => (<View style={{ backgroundColor: Global.colors.IOS_GRAY_BG, height: 210 }} />)}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Global.getScreen().width,
    height: 40,
    // marginTop: 5,
    backgroundColor: 'white',
    flexWrap: 'wrap',
    // marginTop: 15,
    // borderTopWidth: 1 / Global.pixelRatio,
    // borderTopColor: Global.colors.LINE,
  },
  titleText: {
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
  },
  renderRow: {
    width: Global.getScreen().width,
    height: 60,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 36,
    height: 36,
    marginLeft: 10,
    borderRadius: 18,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoName: {
    fontSize: 13,
    textAlign: 'center',
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
});

Reports.navigationOptions = {
  title: '报告查询',
};


const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps, null)(Reports);
