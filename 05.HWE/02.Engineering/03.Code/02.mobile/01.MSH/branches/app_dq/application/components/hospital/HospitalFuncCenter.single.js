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
// import Toast from 'react-native-root-toast';

import Global from '../../Global';
import Ads from './Ads';
import AppFuncs from './AppFuncs';
import Tools from './Tools';
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

  state = {
    doRenderScene: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
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
          {/* <Sep height={15} />
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
          </Card>*/}
          <Sep height={15} />
          <Card fullWidth noPadding >
            <View style={styles.cardTitle} >
              <Text style={styles.cardTitleText} >医院简介</Text>
              <TouchableOpacity
                style={styles.more}
                onPress={() => {
                  this.props.navigate({
                    component: 'Hospital',
                    params: {
                      title: '医院信息',
                      hospital: currHospital,
                    },
                  });
                }}
              >
                <Text style={styles.moreText} >查看详情</Text>
                <Icon
                  iconLib="fa"
                  name="angle-right"
                  size={20}
                  width={30}
                  height={20}
                  color="rgba(199,199,204,1)"
                />
              </TouchableOpacity>
            </View>
            <Text style={{ padding: 15, fontSize: 13, color: Global.colors.FONT_GRAY, lineHeight: 20 }} >{currHospital ? currHospital.brief : ''}</Text>
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
    paddingLeft: 25,
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
