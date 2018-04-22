/**
 * 医院功能区
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Sep from 'rn-easy-separator';
import Card from 'rn-easy-card';
import Icon from 'rn-easy-icon';

import Global from '../../Global';
import Ads from './Ads';
import AppFuncs from './AppFuncs';
import Tools from './Tools';
import { nearest, page } from '../../services/hospital/HospitalService';
import HospitalListItem from './HospitalItem';
import { setCurrHospital, setCurrPatient } from '../../actions/base/BaseAction';

class HospitalFuncCenter extends Component {
  static displayName = 'HospitalFuncCenter';
  static description = '医院功能区';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.INDICATOR_CONTAINER} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.loadNearestHospital = this.loadNearestHospital.bind(this);
    this.loadLatestHospital = this.loadLatestHospital.bind(this);
    this.addHosp = this.addHosp.bind(this);
  }

  state = {
    doRenderScene: false,
    hospitals: [],
    tags: {},
    loading: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        loading: true,
      });
    });
    this.props.screenProps.getCurrentLocation(this.loadNearestHospital);
    this.loadLatestHospital();
  }

  // 获取距离最近的医院
  async loadNearestHospital(position) {
    try {
      if (position && position.longitude !== null && position.latitude !== null) {
        const responseData = await nearest(
          position.longitude,
          position.latitude,
        );
        const { tagConfig } = Global.Config;
        if (responseData.success) {
          this.addHosp(responseData.result, tagConfig.nearest, position);
        } else {
          this.setState({
            loading: false,
            // longitude: position.longitude,
            // latitude: position.latitude,
          });
          this.handleRequestException({ msg: '取离我最近的医院信息出错！' });
        }
      } else {
        this.setState({ loading: false });
      }
    } catch (e) {
      this.setState({ loading: false });
      this.handleRequestException(e);
    }
  }

  // 获取最近去过的医院
  async loadLatestHospital() {
    try {
      // TODO: 暂时写死测试数据，正式版本从用户习惯中取
      // 8a81a7db4dad2271014dad2271e20001 - 北大人民 最常去
      // 8a81a7db4dad2271014dad2271e20005 - 费森尤斯泉州 上次去过
      const responseData = await page(0, 20, null);
      if (responseData.success) {
        const { tagConfig } = Global.Config;
        for (let i = 0; i < responseData.result.length; i++) {
          const hosp = responseData.result[i];
          if (hosp.id === '8a81a7db4dad2271014dad2271e20001') this.addHosp(hosp, tagConfig.frequent/* tagTypes.FREQUENT*/);
          else if (hosp.id === '8a81a7db4dad2271014dad2271e20005') this.addHosp(hosp, tagConfig.latest/* tagTypes.LATEST*/);
        }
      } else {
        this.handleRequestException({ msg: responseData.msg });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }

  // 添加快捷操作医院
  addHosp(hosp, tag, position) {
    this.setState((state) => {
      const hospitals = state.hospitals.concat();
      const tags = { ...state.tags };
      if (hospitals.length === 0) {
        hospitals[hospitals.length] = hosp;
      } else {
        let exist = false;
        for (let i = 0; i < hospitals.length; i++) {
          if (hospitals[i].id === hosp.id) {
            exist = true;
            break;
          }
        }
        if (!exist) hospitals[hospitals.length] = hosp;
      }
      if (tags[hosp.id]) tags[hosp.id][tags[hosp.id].length] = tag;
      else tags[hosp.id] = [tag];
      // console.log(hospitals, tags);
      const pos = position ? {
        longitude: position.longitude,
        latitude: position.latitude,
      } : state.pos;
      return {
        hospitals,
        tags,
        loading: false,
        ...pos,
      };
    });
  }

  renderHosps() {
    if (!this.state.loading && this.state.hospitals.length === 0) {
      return (
        <Text style={styles.noHosp} >
          暂无推荐医院信息...
        </Text>
      );
    }
    return (
      <View>
        {this.state.hospitals.map((item, idx) => {
          const topLine = idx !== 0 ? {
            borderTopWidth: 1 / Global.pixelRatio,
            borderTopColor: Global.colors.LINE,
          } : {};
          return (
            <TouchableOpacity
              key={`h_item_${idx + 1}`}
              style={topLine}
              onPress={() => this.props.navigate({ component: 'Hospital', params: { title: '医院信息', hospital: item } })}
            >
              <HospitalListItem item={item} tags={this.state.tags[item.id]} showScenery={false} showAddrTopLine={false} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return HospitalFuncCenter.renderPlaceholderView();
    }
    const { currHospital } = this.props.base;
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <ScrollView style={styles.scrollView} >
          <Ads navigate={this.props.navigate} />
          <Sep height={15} />
          <AppFuncs
            navigate={this.props.navigate}
            setCurrHospital={this.props.setCurrHospital}
            setCurrPatient={this.props.setCurrPatient}
            currHospital={currHospital}
            base={this.props.base}
          />
          <Sep height={15} />
          <Card fullWidth noPadding >
            <View style={styles.cardTitle} >
              <Text style={styles.cardTitleText} >常用工具</Text>
              <TouchableOpacity style={styles.more} onPress={() => this.props.navigate({ component: 'Tools', params: { title: '健康工具箱' } })} >
                <Text style={styles.moreText} >更多工具</Text>
                <Icon
                  iconLib="fa"
                  name="angle-right"
                  size={20}
                  width={20}
                  height={20}
                  color="rgba(199,199,204,1)"
                />
              </TouchableOpacity>
            </View>
            <Tools navigate={this.props.navigate} />
          </Card>
          <Sep height={15} />
          <Card fullWidth noPadding >
            <View style={styles.cardTitle} >
              <Text style={styles.cardTitleText} >找医院</Text>
              <TouchableOpacity
                style={styles.more}
                onPress={() => {
                  this.props.navigate({
                    component: 'HospitalList',
                    params: {
                      title: '找医院',
                      hideNavBarBottomLine: true,
                    },
                  });
                }}
              >
                <Text style={styles.moreText} >查看更多</Text>
                <Icon
                  iconLib="fa"
                  name="angle-right"
                  size={20}
                  width={20}
                  height={20}
                  color="rgba(199,199,204,1)"
                />
              </TouchableOpacity>
            </View>
            {this.renderHosps()}
            {this.state.loading ? <ActivityIndicator style={{ margin: 20 }} /> : null}
          </Card>
          <Sep height={20} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  cardTitle: {
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cardTitleText: {
    flex: 1,
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  more: {
    width: 90,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  moreText: {
    flex: 1,
    color: Global.colors.IOS_BLUE,
    fontSize: 12,
    // backgroundColor: 'red',
    textAlign: 'right',
    paddingTop: Global.os === 'ios' ? 2 : 0,
  },
  noHosp: {
    flex: 1,
    color: Global.colors.FONT_GRAY,
    fontSize: 14,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});

HospitalFuncCenter.navigationOptions = {
  header: null,
};

const mapStateToProps = state => ({
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
  setCurrHospital: hospital => dispatch(setCurrHospital(hospital)),
  setCurrPatient: (patient, profile) => dispatch(setCurrPatient(patient, profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HospitalFuncCenter);
