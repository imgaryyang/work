/* eslint-disable indent,react/no-unused-state,no-trailing-spaces */
/**
 * 报告查询
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
import Toast from 'react-native-root-toast';
import Sep from 'rn-easy-separator';
import Global from '../../Global';
import ctrlState from '../../modules/ListState';
import { hisTestList } from '../../services/reports/TestService';

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
  static description = '报告单查询';

  constructor(props) {
    super(props);
    this.showDetail = this.showDetail.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.loadCheckList = this.loadCheckList.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.ConventData = this.ConventData.bind(this);
    this.sub = this.sub.bind(this);
    // this.renderProfile = this.renderProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    sections: [],
    profile: {},
    refreshing: false,
    ctrlState,
  };
  componentDidMount() {
    // console.log("this.props.base====",this.props.base);
    const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
        },
      }, () => this.getProfile());
    });
    this.props.navigation.setParams({
      title: '报告查询',
      showCurrHospitalAndPatient: !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
    });
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
  /**
   * 获取检查列表
   */
  getProfile() {
    const { currHospital, currProfile } = this.props.base;
    if ((currHospital == null) || (currHospital === undefined)) {
      Toast.show('未选择当前医院！');
      return null;
    } else if (currProfile === null) {
      Toast.show('当前就诊人无档案！');
      return null;
    } else if (currProfile.status !== '1' || currProfile.hosId !== currHospital.id) {
      Toast.show('当前就诊人在当前医院暂无档案！');
      return null;
    } else {
      this.setState({
      }, () => this.loadCheckList());
    }
  }
  /**
   * 调用接口,不需要条件判断
   */
  async loadCheckList() {
    try {
      const { currHospital, currProfile } = this.props.base;
      // 获得当前的医院Id
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
          // lis 数据
      const query = { proNo: currProfile.no, hosNo: currHospital.no };
      const responseData = await hisTestList(query);
      if (responseData.success === false) {
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
      } else {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
        };
        this.setState({
          data: responseData.result,
        });
        const sections = await this.ConventData();
        await this.setState({
          sections,
          ctrlState: newCtrlState,
        });
      }
          // // pacs 数据
          // const query = { proNo: pro.no, hosNo: hospital.no };
          // const responseData = await loadHisCheckList(query);
          // console.log('responseData===', responseData);
          // if (responseData.success === false) {
          //   Alert.alert(
          //     '提示',
          //     responseData.msg,
          //     [
          //       {
          //         text: '确定',
          //         onPress: () => {
          //           // this.setState({  });
          //         },
          //       },
          //     ],
          //   );
          //   return null;
          // } else {
          //   allData.concat(responseData.result);
          //   console.log('allData===', allData);
          // }
    } catch (e) {
      // 隐藏遮罩
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
   * 设置医院
   */
  async afterChooseHospital(hospital) {
    await this.getProfile(hospital, this.props.base.currPatient);
    await this.loadCheckList();
  }
  /**
   * 设置病人
   */
  afterChoosePatient(patient, profile) {
    if (typeof profile !== 'undefined' && profile !== null) {
      this.setState({
        profile,
      }, () => this.getProfile());
    }
  }
  sub(value) {
    const index = value.indexOf(' ');
    return value.substring(0, index);
  }
  // 转换成以时间分组的sections
  ConventData() {
    const result = this.state.data;
    const sections = [];
    for (let i = 0; i < result.length; i++) {
      let isFind = false;
      const date = this.sub(result[i].reportTime);
      const info = {};
      info.key = date;
      const dataArry = [];
      result[i].type = '0001';
      dataArry.push(result[i]);
      info.data = dataArry;
      if (i === 0) {
        sections.push(info);
      } else {
        for (let j = 0; j < sections.length; j++) {
          if (sections[j].key === date) {
            isFind = true;
            sections[j].data.push(result[i]);
            break;
          }
        }
        // 如果之前没有相同的日期
        if (!isFind) {
          sections.push(info);
        }
      }
    }
    return sections;
  }
  showDetail(item, index) {
    if (typeof index !== 'undefined') this.setState({ index });
    if (item.type = '0001') {
      this.props.navigation.navigate('ShowLisDetail', {
        barcode: item.barcode,
        data: item,
        checkId: item.id,
        checkName: item.itemName,
        index,
      });
    } else {
      this.props.navigation.navigate('ShowPacsDetail', {
        barcode: item.barcode,
        data: item,
        checkId: item.id,
        checkName: item.itemName,
        index,
      });
    }
  }
  // renderProfile(hospital, item) {
  //   const { profiles } = item;
  //   if (profiles !== null) {
  //     const length = profiles.length ? profiles.length : 0;
  //     for (let i = 0; i < length; i++) {
  //       const pro = profiles[i];
  //       if (pro.status === '1' && pro.hosId === hospital.id) {
  //         this.setState({
  //           profile: pro,
  //         });
  //       }
  //     }
  //   }
  // }
  /**
   * 列表展示
   */
  renderItem({ item, index }) {
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
                    reloadCallback: this.loadCheckList,
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
    height: 30,
    // marginTop: 5,
    backgroundColor: Global.colors.IOS_GRAY,
    flexWrap: 'wrap',
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
    width: 42,
    height: 42,
    marginLeft: 10,
    borderRadius: 21,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoName: {
    fontSize: 15,
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
