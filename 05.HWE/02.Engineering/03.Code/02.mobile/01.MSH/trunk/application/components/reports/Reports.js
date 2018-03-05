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
  Alert,
  SectionList,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import Sep from 'rn-easy-separator';
import Global from '../../Global';
import ctrlState from '../../modules/ListState';
import { loadHisCheckList } from '../../services/reports/MedicalCheckService';


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
           </View>
         </TouchableOpacity>
       );
     }
}


class Reports extends Component {
  static displayName = 'Reports';
  static description = '报告单查询';


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
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.ConventData = this.ConventData.bind(this);
    this.sub = this.sub.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.renderSection = this.renderSection.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    sections: [],
    profile: {},
    ctrlState,
  };
  componentWillMount() {
    this.loadCheckList();
  }
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
      title: '报告查询',
      showCurrHospitalAndPatient: !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
    });
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
            }, () => this.loadCheckList());
          }
        }
      } else {
        Toast.show('当前就诊人在当前医院暂无档案！');
        return null;
      }
    }
  }
  async afterChooseHospital(hospital) {
    await this.getProfile(hospital, this.props.base.currPatient);
    await this.loadCheckList();
  }
  afterChoosePatient(patient, profile) {
    if (typeof profile !== 'undefined' && profile !== null) {
      this.setState({
        profile,
      }, () => this.loadCheckList());
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
    let isFind = false;
    for (let i = 0; i < result.length; i++) {
      const date = this.sub(result[i].reportTime);
      const info = {};
      info.key = date;
      const dataArry = [];
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

  async loadCheckList() {
    try {
      // 获得当前的医院Id
      const hosNo = this.props.base.currHospital.no;
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
      const profileNo = this.state.profile.no;
      const query = { proNo: profileNo, hosNo };
      const responseData = await loadHisCheckList(query);
      if (responseData.success === true) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
        };

        // 隐藏遮罩
        // this.props.screenProps.hideLoading();
        await this.setState({
          data: responseData.result,
          ctrlState: newCtrlState,
        });

        const sections = await this.ConventData();
        await this.setState({
          sections,
        });
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


  showDetail(item, index) {
    if (typeof index !== 'undefined') this.setState({ index });
    this.props.navigation.navigate('ShowDetailItems', {
      // checkId: item.id,
      barcode: item.barcode,
      checkName: item.itemName,
      index,
    });
  }
  renderProfile(hospital, item) {
    const { profiles } = item;
    if (profiles !== null) {
      const length = profiles.length ? profiles.length : 0;
      for (let i = 0; i < length; i++) {
        const pro = profiles[i];
        if (pro.status === '1' && pro.hosId === hospital.id) {
          this.setState({
            profile: pro,
          });
        }
      }
    }
  }
  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
        onPressItem={this.showDetail}
      />
    );
  }
    renderSection=() => {
      return (<View style={{ marginTop: 15, height: 10, width: Global.getScreen().width, borderWidth: 1, borderColor: 'blue' }} />);
    }
    renderTitle = (info) => {
      const checkDate = info.section.key;
      const weekday = `周${'日一二三四五六'.charAt(moment(checkDate, 'YYYY-MM-DD').day())}`;
      const size = info.section.data.length;
      return (
        <View style={styles.titleaaaaaa} >
          <Text style={styles.titleText}>{checkDate} </Text>
          <Text style={styles.titleText}>{weekday} {size}个报告 </Text>
          <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
        </View>

      );
    }

    render() {
      console.log(this.state.profile.no);
      console.log(this.props.base.currHospital);
      // 场景过渡动画未完成前，先渲染过渡场景
      if (!this.state.doRenderScene) {
        return Reports.renderPlaceholderView();
      }

      return (
        <View style={Global.styles.CONTAINER_BG} >

          <Sep height={2 / Global.pixelRatio} bgColor={Global.colors.LINE} />
          <SectionList
            renderSectionHeader={this.renderTitle}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            renderItem={this.renderItem}
            sections={this.state.sections}
              // 控制下拉刷新
            refreshing={this.state.ctrlState.refreshing}
            onRefresh={this.loadCheckList}
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
  scrollView: {
    flex: 1,
  },
  container: {
    width: Global.getScreen().width,
    overflow: 'hidden',
    backgroundColor: Global.colors.IOS_GRAY_BG,
  },
  patientBorder: {
    flexDirection: 'row',
    width: 410,
    height: 72,
    marginTop: 10,
    borderStyle: 'solid',
    alignItems: 'flex-start',
  },
  mainInfoContainer: {
    width: Global.getScreen().width,
    height: 72,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'red',

  },
  nameContainer: {
    width: Global.getScreen().width,
    height: 21,

    fontSize: 15,
    color: 'black',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  name: {
    width: 50,
    height: 21,
    marginTop: 10,
    marginLeft: 10,

    fontSize: 15,
    color: 'black',
  },
  card: {
    width: 200,
    height: 21,
    marginTop: 2,
    marginLeft: 10,

    fontSize: 15,
    color: '#999999',
  },
  icon: {
    marginTop: 8,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    flex: 1,

  },
  aa: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: Global.getScreen().width,
  },
  titleaaaaaa: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Global.getScreen().width,
    height: 40,
    marginTop: 15,
    backgroundColor: 'white',
    flexWrap: 'wrap',
    // borderWidth: 1,
    // borderColor: 'red',
    // borderTopWidth: 0,
  },
  addrContainer: {
    flexDirection: 'row',
    borderTopColor: Global.colors.LINE,
    borderTopWidth: 1 / Global.pixelRatio,
    justifyContent: 'center',
    alignItems: 'center',
    width: Global.getScreen().width - 10,
    left: 10,
    // borderColor: 'red',
    // borderWidth: 1,
  },
  titleText: {
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
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
    marginLeft: 10,
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

});

Reports.navigationOptions = {
  title: '报告查询',
};


const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps, null)(Reports);
